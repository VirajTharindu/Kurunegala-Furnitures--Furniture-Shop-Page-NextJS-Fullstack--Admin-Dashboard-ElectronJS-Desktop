"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 w-full z-50 px-10 py-8 flex items-center justify-between"
        >
            <div className="flex items-center gap-12 text-[10px] uppercase tracking-[0.4em] text-gray-900 font-bold">
                <button className="hover:opacity-50 transition-opacity">Menu</button>
                <button className="hover:opacity-50 transition-opacity hidden md:block">Collections</button>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
                <h1 className="text-2xl font-serif italic tracking-tight">Kurunegala.</h1>
            </div>

            <div className="flex items-center gap-8">
                <Search size={18} className="text-gray-900 cursor-pointer hover:opacity-50 transition-opacity" />
                <div className="relative cursor-pointer hover:opacity-50 transition-opacity">
                    <ShoppingBag size={18} className="text-gray-900" />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-gray-900 text-white text-[8px] flex items-center justify-center rounded-full">0</span>
                </div>
            </div>
        </motion.nav>
    );
}
