"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Search,
    Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import WindowControls from "./WindowControls";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Package, label: "Inventory", href: "/admin/inventory" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState("");

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans border border-white/5">
            {/* Custom Titlebar / Drag Area */}
            <div className="h-12 w-full flex justify-between items-center bg-black border-b border-white/10 z-[100] drag select-none shrink-0">
                <div className="flex items-center gap-2 px-6 no-drag">
                    <div className="w-5 h-5 bg-gradient-to-tr from-amber-500 to-amber-200 rounded flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Package className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/60">Management Terminal</span>
                </div>
                <WindowControls />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Glassmorphic Sidebar */}
                <motion.aside
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col p-6 z-50"
                >
                    <div className="mb-12 flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-amber-200 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-serif italic tracking-wider">Kurunegala</span>
                    </div>

                    <nav className="flex-1 flex flex-col gap-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                                        isActive
                                            ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "group-hover:scale-110 transition-transform")} />
                                    <span className="text-sm font-medium tracking-wide">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/10">
                        <button 
                            onClick={() => router.push('/')}
                            className="flex items-center gap-4 px-4 py-3 text-white/40 hover:text-red-400 transition-colors w-full group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Header */}
                    <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/50 backdrop-blur-md z-40">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery) router.push(`/admin/inventory?q=${encodeURIComponent(searchQuery)}`);
                            }}
                            className="relative w-96 group"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                            />
                        </form>

                        <div className="flex items-center gap-6">
                            <button className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-black" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-sm font-bold">Admin User</div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Manager</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20" />
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-30">
                        {children}
                    </main>

                    {/* Abstract Background Accents */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
