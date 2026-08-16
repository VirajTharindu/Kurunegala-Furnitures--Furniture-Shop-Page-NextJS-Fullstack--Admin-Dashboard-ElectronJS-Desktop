import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication - Kurunegala Furnitures',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background animated blobs or patterns could go here */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 z-10">
                {children}
            </div>
        </div>
    );
}
