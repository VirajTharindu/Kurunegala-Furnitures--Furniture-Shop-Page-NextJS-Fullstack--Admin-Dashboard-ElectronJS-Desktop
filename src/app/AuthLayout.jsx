import React from 'react';


const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-background/95 backdrop-blur-lg border border-border rounded-2xl shadow-2xl p-8">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
