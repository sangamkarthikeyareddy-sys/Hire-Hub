import React from 'react';
import { Button } from '@/components/ui/button';

const UserNotRegisteredError = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            <h1 className="text-2xl font-bold mb-4">Account Not Found</h1>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
                We couldn't find an account matching your credentials. Please make sure you have an account with HireHub or contact support.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => window.location.href = '/'}>Go Home</Button>
                <Button variant="outline" onClick={() => window.location.href = '/login'}>Try Again</Button>
            </div>
        </div>
    );
};

export default UserNotRegisteredError;
