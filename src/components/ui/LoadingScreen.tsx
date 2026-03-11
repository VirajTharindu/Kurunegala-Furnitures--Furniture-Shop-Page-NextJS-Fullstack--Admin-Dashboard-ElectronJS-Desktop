"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 100);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center"
                >
                    <div className="relative flex flex-col items-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-serif italic mb-2 tracking-tighter"
                        >
                            Kurunegala.
                        </motion.h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            className="w-32 h-[1px] bg-gray-100 relative overflow-hidden"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gray-900 origin-left"
                                style={{ scaleX: progress / 100 }}
                            />
                        </motion.div>
                        <span className="mt-4 text-[8px] uppercase tracking-[0.5em] text-gray-400 font-bold">
                            Crafting Immersion
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
