/**
 * ═══════════════════════════════════════════════════════════
 *  HireHub — Multi-Source Real-Time Job API Service
 * ═══════════════════════════════════════════════════════════
 *
 *  Sources:
 *    1. JSearch     — RapidAPI. Aggregates Indeed / LinkedIn / Glassdoor.
 *    2. Adzuna      — Developer API. Real jobs from India, US, UK, AU.
 *    3. Arbeitnow   — Free, no key. Global tech & remote jobs.
 *    4. The Muse    — Free, no key. US companies (Google, Apple, etc.)
 *
 *  All sources are normalised into a single job shape.
 * ═══════════════════════════════════════════════════════════
 */

/* ── env helpers ─────────────────────────────────────────── */
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "";
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID || "";
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY || "";

/* ── simple in-memory cache (5 min TTL) ──────────────────── */
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key) {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
    return null;
}

function setCache(key, data) {
    cache.set(key, { data, ts: Date.now() });
}

/* ═════════════════════════════════════════════════════════
   1.  JSEARCH  (RapidAPI — Indeed / LinkedIn / Glassdoor)
   ═════════════════════════════════════════════════════════ */
async function fetchJSearch({
    search = "software developer",
    page = 1,
    remoteOnly = false,
    employmentType = "",
    country = "us",
} = {}) {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === "your_rapidapi_key_here") return [];

    try {
        const params = new URLSearchParams({
            query: search,
            page: String(page),
            num_pages: "1",
            country,
        });
        if (remoteOnly) params.set("remote_jobs_only", "true");
        if (employmentType) params.set("employment_types", employmentType);

        const url = `https://jsearch.p.rapidapi.com/search?${params}`;
        const cacheKey = `jsearch:${url}`;
        const cached = getCached(cacheKey);
        if (cached) return cached;

        const res = await fetch(url, {
            headers: {
                "x-rapidapi-key": RAPIDAPI_KEY,
                "x-rapidapi-host": "jsearch.p.rapidapi.com",
            },
        });

        if (!res.ok) throw new Error(`JSearch ${res.status}`);
        const json = await res.json();

        const jobs = (json.data || []).map((j) => ({
            id: `jsearch-${j.job_id}`,
            source: "JSearch",
            title: j.job_title || "Untitled",
            company_name: j.employer_name || "Unknown",
            company_logo: j.employer_logo || "",
            category: j.job_category || "",
            job_type: mapJSearchType(j.job_employment_type),
            candidate_required_location: buildJSearchLocation(j),
            description: j.job_description || "",
            url: j.job_apply_link || "",
            publication_date: j.job_posted_at_datetime_utc || "",
            salary: buildJSearchSalary(j),
            tags: j.job_required_skills?.slice(0, 5) || [],
        }));

        setCache(cacheKey, jobs);
        return jobs;
    } catch (err) {
        console.warn("[JSearch] fetch failed:", err.message);
        return [];
    }
}

function mapJSearchType(type) {
    if (!type) return "other";
    const map = {
        FULLTIME: "full_time",
        PARTTIME: "part_time",
        CONTRACTOR: "contract",
        INTERN: "internship",
        FREELANCE: "freelance",
    };
    return map[type] || "other";
}

function buildJSearchLocation(j) {
    const parts = [j.job_city, j.job_state, j.job_country].filter(Boolean);
    if (j.job_is_remote) {
        return parts.length ? `Remote • ${parts.join(", ")}` : "Remote";
    }
    return parts.join(", ") || "Not specified";
}

function buildJSearchSalary(j) {
    if (!j.job_min_salary && !j.job_max_salary) return "";
    const curr = j.job_salary_currency || "USD";
    const min = j.job_min_salary ? `${curr} ${Number(j.job_min_salary).toLocaleString()}` : "";
    const max = j.job_max_salary ? `${curr} ${Number(j.job_max_salary).toLocaleString()}` : "";
    if (min && max) return `${min} – ${max}`;
    return min || max;
}

/* ═════════════════════════════════════════════════════════
   2.  ADZUNA  (Global job boards — US, UK, India, AU …)
   ═════════════════════════════════════════════════════════ */
async function fetchAdzuna({
    search = "developer",
    country = "in",
    page = 1,
    resultsPerPage = 30,
} = {}) {
    if (!ADZUNA_APP_ID || ADZUNA_APP_ID === "your_adzuna_app_id_here") return [];

    try {
        const params = new URLSearchParams({
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_APP_KEY,
            what: search,
            results_per_page: String(resultsPerPage),
            content_type: "application/json",
        });

        const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${params}`;
        const cacheKey = `adzuna:${url}`;
        const cached = getCached(cacheKey);
        if (cached) return cached;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Adzuna ${res.status}`);
        const json = await res.json();

        const jobs = (json.results || []).map((j) => ({
            id: `adzuna-${j.id}`,
            source: "Adzuna",
            title: j.title || "Untitled",
            company_name: j.company?.display_name || "Unknown",
            company_logo: "",
            category: j.category?.label || "",
            job_type: mapAdzunaType(j.contract_type, j.contract_time),
            candidate_required_location: j.location?.display_name || "Not specified",
            description: j.description || "",
            url: j.redirect_url || "",
            publication_date: j.created || "",
            salary: buildAdzunaSalary(j),
            tags: [],
        }));

        setCache(cacheKey, jobs);
        return jobs;
    } catch (err) {
        console.warn("[Adzuna] fetch failed:", err.message);
        return [];
    }
}

function mapAdzunaType(contractType, contractTime) {
    if (contractTime === "part_time") return "part_time";
    if (contractType === "contract") return "contract";
    if (contractType === "permanent") return "full_time";
    return "full_time";
}

function buildAdzunaSalary(j) {
    if (!j.salary_min && !j.salary_max) return "";
    const min = j.salary_min ? `₹${Number(j.salary_min).toLocaleString()}` : "";
    const max = j.salary_max ? `₹${Number(j.salary_max).toLocaleString()}` : "";
    if (min && max) return `${min} – ${max}`;
    return min || max;
}

/* ═════════════════════════════════════════════════════════
   3.  ARBEITNOW  (Free, no key — global tech/remote jobs)
   ═════════════════════════════════════════════════════════ */
async function fetchArbeitnow({ search = "", page = 1 } = {}) {
    try {
        const url = `https://www.arbeitnow.com/api/job-board-api?page=${page}`;
        const cacheKey = `arbeitnow:${url}:${search}`;
        const cached = getCached(cacheKey);
        if (cached) return cached;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Arbeitnow ${res.status}`);
        const json = await res.json();

        let jobs = (json.data || [])
            // ── ENGLISH ONLY: filter out German/French/other languages ──
            .filter((j) => isEnglish(j.title) && isEnglish(j.company_name))
            .map((j) => ({
                id: `arbeitnow-${j.slug}`,
                source: "Arbeitnow",
                title: j.title || "Untitled",
                company_name: j.company_name || "Unknown",
                company_logo: "",
                category: (j.tags && j.tags[0]) || "",
                job_type: mapArbeitnowType(j.job_types),
                candidate_required_location: j.location || (j.remote ? "Remote" : "On-site"),
                description: j.description || "",
                url: j.url || `https://www.arbeitnow.com/view/${j.slug}`,
                publication_date: j.created_at ? new Date(j.created_at * 1000).toISOString() : "",
                salary: "",
                tags: j.tags?.slice(0, 5) || [],
            }));

        // Client-side search filter
        if (search.trim()) {
            const q = search.toLowerCase();
            jobs = jobs.filter(
                (j) =>
                    j.title.toLowerCase().includes(q) ||
                    j.company_name.toLowerCase().includes(q) ||
                    j.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        setCache(cacheKey, jobs);
        return jobs;
    } catch (err) {
        console.warn("[Arbeitnow] fetch failed:", err.message);
        return [];
    }
}

function mapArbeitnowType(types) {
    if (!types || !Array.isArray(types)) return "full_time";
    const t = types.map((x) => x.toLowerCase());
    if (t.includes("part-time") || t.includes("part_time")) return "part_time";
    if (t.includes("contract")) return "contract";
    if (t.includes("freelance")) return "freelance";
    if (t.includes("internship")) return "internship";
    return "full_time";
}

/* ═════════════════════════════════════════════════════════
   4.  THE MUSE  (Free, no key — US companies: Google, Apple…)
   ═════════════════════════════════════════════════════════ */
async function fetchTheMuse({ search = "", page = 0, category = "" } = {}) {
    try {
        const params = new URLSearchParams({ page: String(page) });
        if (category) params.set("category", category);
        // The Muse doesn't have a search param, but has category filter

        const url = `https://www.themuse.com/api/public/jobs?${params}`;
        const cacheKey = `themuse:${url}:${search}`;
        const cached = getCached(cacheKey);
        if (cached) return cached;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`TheMuse ${res.status}`);
        const json = await res.json();

        let jobs = (json.results || []).map((j) => ({
            id: `themuse-${j.id}`,
            source: "TheMuse",
            title: j.name || "Untitled",
            company_name: j.company?.name || "Unknown",
            company_logo: "",
            category: j.categories?.[0]?.name || "",
            job_type: mapMuseLevel(j.levels),
            candidate_required_location: j.locations?.map((l) => l.name).join(", ") || "Flexible",
            description: j.contents || "",
            url: j.refs?.landing_page || "",
            publication_date: j.publication_date || "",
            salary: "",
            tags: j.categories?.map((c) => c.name)?.slice(0, 5) || [],
        }));

        // Client-side search filter
        if (search.trim()) {
            const q = search.toLowerCase();
            jobs = jobs.filter(
                (j) =>
                    j.title.toLowerCase().includes(q) ||
                    j.company_name.toLowerCase().includes(q) ||
                    j.category.toLowerCase().includes(q)
            );
        }

        setCache(cacheKey, jobs);
        return jobs;
    } catch (err) {
        console.warn("[TheMuse] fetch failed:", err.message);
        return [];
    }
}

function mapMuseLevel(levels) {
    if (!levels || levels.length === 0) return "full_time";
    const name = levels[0].name?.toLowerCase() || "";
    if (name.includes("intern")) return "internship";
    if (name.includes("entry")) return "full_time";
    if (name.includes("senior") || name.includes("mid")) return "full_time";
    return "full_time";
}

/* ═════════════════════════════════════════════════════════
   SHARED UTILITIES
   ═════════════════════════════════════════════════════════ */

/**
 * Detect if text is likely English.
 * Filters out German (ä ö ü ß), French (é è ê ë ç),
 * and other non-Latin-basic heavy text.
 */
function isEnglish(text) {
    if (!text) return true;
    // Common non-English character patterns
    const nonEnglishPattern = /[äöüßÄÖÜéèêëàâçîïôùûœæñ¿¡]/;
    // German / French / Spanish word patterns (m/w/d is a German job marker)
    const nonEnglishWords = /\b(und|oder|für|mit|auf|wir|der|die|das|m\/w\/d|gmbh|suchen|bei|zur|nous|avec|pour|les|une|des)\b/i;
    
    if (nonEnglishPattern.test(text)) return false;
    if (nonEnglishWords.test(text)) return false;
    
    // If more than 15% of characters are non-ASCII, probably not English
    const nonAscii = text.replace(/[\x00-\x7F]/g, "").length;
    if (text.length > 10 && nonAscii / text.length > 0.15) return false;
    
    return true;
}

/* ═════════════════════════════════════════════════════════
   PUBLIC API — used by pages / hooks
   ═════════════════════════════════════════════════════════ */

/**
 * Fetch jobs from ALL configured sources in parallel.
 * Returns { jobs: NormalizedJob[], sources: string[] }
 */
export async function fetchAllJobs({ search = "" } = {}) {
    // Default to 'us' for APIs that require a country
    const defaultCountry = "us";

    const settled = await Promise.allSettled([
        fetchJSearch({ search: search || "developer", country: defaultCountry }),
        fetchAdzuna({ search: search || "developer", country: defaultCountry }),
        fetchArbeitnow({ search }),
        fetchTheMuse({ search }),
    ]);

    const jobs = [];
    const activeSources = [];
    const sourceNames = ["JSearch", "Adzuna", "Arbeitnow", "TheMuse"];

    settled.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value.length > 0) {
            jobs.push(...result.value);
            activeSources.push(sourceNames[idx]);
        }
    });

    return { jobs, sources: activeSources };
}

/**
 * Fetch jobs from a SINGLE source.
 */
export async function fetchJobsBySource(source, { search = "", page = 1 } = {}) {
    const defaultCountry = "us";

    switch (source) {
        case "JSearch":
            return fetchJSearch({ search: search || "developer", page, country: defaultCountry });
        case "Adzuna":
            return fetchAdzuna({ search: search || "developer", page, country: defaultCountry });
        case "Arbeitnow":
            return fetchArbeitnow({ search, page });
        case "TheMuse":
            return fetchTheMuse({ search, page: page - 1 });
        default:
            return [];
    }
}

/**
 * Find a single job by its normalised composite id.
 */
export async function fetchJobById(compositeId) {
    const [source, ...rest] = compositeId.split("-");
    const originalId = rest.join("-");

    // JSearch — use job-details endpoint
    if (source === "jsearch" && RAPIDAPI_KEY && RAPIDAPI_KEY !== "your_rapidapi_key_here") {
        try {
            const cacheKey = `jsearch-detail:${originalId}`;
            const cached = getCached(cacheKey);
            if (cached) return cached;

            const url = `https://jsearch.p.rapidapi.com/job-details?job_id=${encodeURIComponent(originalId)}&extended_publisher_details=false`;
            const res = await fetch(url, {
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": "jsearch.p.rapidapi.com",
                },
            });

            if (!res.ok) throw new Error(`JSearch detail ${res.status}`);
            const json = await res.json();
            const j = json.data?.[0];
            if (!j) return null;

            const job = {
                id: compositeId,
                source: "JSearch",
                title: j.job_title || "Untitled",
                company_name: j.employer_name || "Unknown",
                company_logo: j.employer_logo || "",
                category: j.job_category || "",
                job_type: mapJSearchType(j.job_employment_type),
                candidate_required_location: buildJSearchLocation(j),
                description: j.job_description || "",
                url: j.job_apply_link || "",
                publication_date: j.job_posted_at_datetime_utc || "",
                salary: buildJSearchSalary(j),
                tags: j.job_required_skills?.slice(0, 5) || [],
            };

            setCache(cacheKey, job);
            return job;
        } catch (err) {
            console.warn("[JSearch] detail failed:", err.message);
            return null;
        }
    }

    // Adzuna — search and match
    if (source === "adzuna") {
        const jobs = await fetchAdzuna({ search: "", country: "in" });
        return jobs.find((j) => j.id === compositeId) || null;
    }

    // Arbeitnow — fetch and match
    if (source === "arbeitnow") {
        const jobs = await fetchArbeitnow({});
        return jobs.find((j) => j.id === compositeId) || null;
    }

    // The Muse — fetch and match
    if (source === "themuse") {
        const jobs = await fetchTheMuse({});
        return jobs.find((j) => j.id === compositeId) || null;
    }

    return null;
}

/**
 * Returns which API sources are configured / available.
 */
export function getAvailableSources() {
    const sources = [];
    if (RAPIDAPI_KEY && RAPIDAPI_KEY !== "your_rapidapi_key_here") {
        sources.push("JSearch");
    }
    if (ADZUNA_APP_ID && ADZUNA_APP_ID !== "your_adzuna_app_id_here") {
        sources.push("Adzuna");
    }
    // Always available — no key needed
    sources.push("Arbeitnow");
    sources.push("TheMuse");
    return sources;
}
