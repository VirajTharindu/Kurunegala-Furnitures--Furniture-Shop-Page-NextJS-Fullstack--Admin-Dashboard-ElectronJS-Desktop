"use client";

import { Minus, Square, X, Copy } from "lucide-react";
import { useState, useEffect } from "react";

export default function WindowControls() {
    const [isMaximized, setIsMaximized] = useState(false);

    const handleMinimize = () => {
        (window as any).electronAPI?.windowControls.minimize();
    };

    const handleMaximize = () => {
        (window as any).electronAPI?.windowControls.maximize();
        setIsMaximized(!isMaximized);
    };

    const handleClose = () => {
        (window as any).electronAPI?.windowControls.close();
    };

    return (
        <div className="flex items-center h-full no-drag">
            <button
                onClick={handleMinimize}
                className="w-12 h-full flex items-center justify-center hover:bg-white/10 active:bg-white/5 transition-colors group"
                title="Minimize"
            >
                <Minus className="w-4 h-4 text-white/40 group-hover:text-white" />
            </button>
            <button
                onClick={handleMaximize}
                className="w-12 h-full flex items-center justify-center hover:bg-white/10 active:bg-white/5 transition-colors group"
                title={isMaximized ? "Restore" : "Maximize"}
            >
                {isMaximized ? (
                    <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-white rotate-180" />
                ) : (
                    <Square className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
                )}
            </button>
            <button
                onClick={handleClose}
                className="w-12 h-full flex items-center justify-center hover:bg-red-500 active:bg-red-600 transition-colors group"
                title="Close"
            >
                <X className="w-4 h-4 text-white/40 group-hover:text-white" />
            </button>
        </div>
    );
}
