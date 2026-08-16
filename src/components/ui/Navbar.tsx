"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [fullMenuOpen, setFullMenuOpen] = useState(false);

    // Scroll tracking to hide navbar on scroll down
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        // Add background blur when scrolled down slightly
        setScrolled(latest > 50);

        // Hide navbar when scrolling down, show when scrolling up
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: hidden ? -100 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`fixed top-0 left-0 w-full z-50 px-10 py-8 flex items-center justify-between transition-colors duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50 py-4" : ""
                    }`}
            >
                <div className="flex items-center gap-12 text-[10px] uppercase tracking-[0.4em] text-foreground font-bold">
                    <button
                        onClick={() => setFullMenuOpen(true)}
                        className="hover:opacity-50 transition-opacity"
                    >
                        Menu
                    </button>
                    <Link href="/#categories" className="hover:opacity-50 transition-opacity hidden md:block">
                        Collections
                    </Link>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link href="/">
                        <h1 className="text-2xl font-serif italic tracking-tight text-foreground">Kurunegala.</h1>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <Search size={18} className="text-foreground cursor-pointer hover:opacity-50 transition-opacity" />
                    <div className="relative cursor-pointer hover:opacity-50 transition-opacity">
                        <ShoppingBag size={18} className="text-foreground" />
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-accent-foreground text-[8px] flex items-center justify-center rounded-full">0</span>
                    </div>

                    {/* Auth UI */}
                    {status === "loading" ? (
                        <div className="w-5 h-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
                    ) : session ? (
                        <div className="relative flex items-center gap-2">
                            {/* Invisible backdrop — closes menu on outside click */}
                            {menuOpen && (
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setMenuOpen(false)}
                                />
                            )}

                            {/* Avatar — direct link to profile */}
                            <Link
                                href="/profile"
                                className="relative z-50 flex items-center gap-2 hover:opacity-70 transition-opacity"
                                title="View profile"
                            >
                                <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-bold ring-2 ring-accent/30">
                                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                            </Link>

                            {/* ⋯ More options toggle */}
                            <button
                                onClick={() => setMenuOpen(prev => !prev)}
                                className="relative z-50 text-foreground/50 hover:text-foreground transition-colors text-lg leading-none pb-1"
                                title="More options"
                            >
                                ···
                            </button>

                            {/* Dropdown — z-50, sits above backdrop */}
                            {menuOpen && (
                                <div className="absolute right-0 top-10 w-48 bg-background border border-border rounded-xl shadow-xl py-2 flex flex-col z-50">
                                    <div className="px-4 py-2 border-b border-border mb-2">
                                        <p className="text-xs font-bold truncate">{session.user?.name}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{session.user?.email}</p>
                                    </div>

                                    {session.user?.role === "ADMIN" && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-accent hover:text-accent-foreground transition-colors text-left w-full"
                                        >
                                            <LayoutDashboard size={14} />
                                            Admin Panel
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => { setMenuOpen(false); signOut(); }}
                                        className="flex items-center gap-3 px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors w-full text-left border-t border-border pt-2 mt-1"
                                    >
                                        <LogOut size={14} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                    ) : (
                        <Link
                            href="/login"
                            className="text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-50 transition-opacity flex items-center gap-2"
                        >
                            <User size={14} />
                            Login
                        </Link>
                    )}
                </div>
            </motion.nav>

            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {fullMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center"
                    >
                        <button
                            onClick={() => setFullMenuOpen(false)}
                            className="absolute top-10 right-10 text-[10px] uppercase tracking-[0.4em] font-bold hover:opacity-50 transition-opacity"
                        >
                            Close
                        </button>

                        <div className="flex flex-col items-center gap-8 text-4xl font-serif italic">
                            <Link href="/" onClick={() => setFullMenuOpen(false)} className="hover:opacity-50 transition-opacity">
                                Home
                            </Link>
                            <Link href="/#categories" onClick={() => setFullMenuOpen(false)} className="hover:opacity-50 transition-opacity">
                                Collections
                            </Link>
                            <Link href="/#configurator" onClick={() => setFullMenuOpen(false)} className="hover:opacity-50 transition-opacity">
                                3D Configurator
                            </Link>
                            {session ? (
                                <Link href="/profile" onClick={() => setFullMenuOpen(false)} className="hover:opacity-50 transition-opacity">
                                    My Profile
                                </Link>
                            ) : (
                                <Link href="/login" onClick={() => setFullMenuOpen(false)} className="hover:opacity-50 transition-opacity">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
