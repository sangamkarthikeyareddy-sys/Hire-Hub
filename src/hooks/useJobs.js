import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
    fetchAllJobs,
    fetchJobsBySource,
    fetchJobById,
    getAvailableSources,
} from "../api/jobApi";

/**
 * Custom hook for fetching jobs from all configured API sources.
 */
export function useJobs(initialSearch = "") {
    const [rawJobs, setRawJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSource, setActiveSource] = useState("All");
    const [activeSources, setActiveSources] = useState([]);
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState("all");
    const [jobType, setJobType] = useState("all");
    const fetchId = useRef(0);

    const availableSources = useMemo(() => ["All", ...getAvailableSources()], []);

    const fetchJobs = useCallback(
        async (query = "") => {
            const id = ++fetchId.current;
            setLoading(true);
            setError(null);

            try {
                let jobs;
                if (activeSource === "All") {
                    const result = await fetchAllJobs({ search: query });
                    jobs = result.jobs;
                    if (id === fetchId.current) setActiveSources(result.sources);
                } else {
                    jobs = await fetchJobsBySource(activeSource, { search: query });
                    if (id === fetchId.current) setActiveSources([activeSource]);
                }

                if (id === fetchId.current) {
                    setRawJobs(jobs);
                    setLoading(false);
                }
            } catch (err) {
                if (id === fetchId.current) {
                    setError(err.message || "Failed to fetch jobs");
                    setLoading(false);
                }
            }
        },
        [activeSource]
    );

    // Fetch on mount and when source changes
    useEffect(() => {
        fetchJobs(search);
    }, [activeSource]); // eslint-disable-line react-hooks/exhaustive-deps

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJobs(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

    // Derived: unique categories & job types from raw data
    const categories = useMemo(() => {
        const set = new Set(rawJobs.map((j) => j.category).filter(Boolean));
        return [...set].sort();
    }, [rawJobs]);

    const jobTypes = useMemo(() => {
        const set = new Set(rawJobs.map((j) => j.job_type).filter(Boolean));
        return [...set].sort();
    }, [rawJobs]);

    // Filtered jobs (client-side filtering on top of API results)
    const filteredJobs = useMemo(() => {
        let result = rawJobs;

        if (category !== "all") {
            result = result.filter((j) => j.category === category);
        }
        if (jobType !== "all") {
            result = result.filter((j) => j.job_type === jobType);
        }

        return result;
    }, [rawJobs, category, jobType]);

    const clearFilters = useCallback(() => {
        setSearch("");
        setCategory("all");
        setJobType("all");
    }, []);

    const refresh = useCallback(() => {
        fetchJobs(search);
    }, [fetchJobs, search]);

    return {
        jobs: filteredJobs,
        allJobs: rawJobs,
        loading,
        error,
        activeSource,
        setActiveSource,
        availableSources,
        activeSources,
        search,
        setSearch,
        category,
        setCategory,
        jobType,
        setJobType,
        categories,
        jobTypes,
        clearFilters,
        refresh,
    };
}

/**
 * Fetch a single job by its composite id.
 */
export function useJobDetail(id) {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchJobById(id)
            .then((found) => {
                if (cancelled) return;
                if (found) {
                    setJob(found);
                } else {
                    setError("Job not found");
                }
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err.message || "Failed to load job");
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    return { job, loading, error };
}
