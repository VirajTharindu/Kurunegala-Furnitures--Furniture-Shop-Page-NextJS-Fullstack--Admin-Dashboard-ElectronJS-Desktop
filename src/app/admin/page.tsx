"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";
import Scene from "@/components/canvas/Scene";
import ProductModel from "@/components/models/ProductModel";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Product } from "@/lib/db";

const stats = [
    { label: "Total Revenue", value: "$428,500", trend: "+12.5%", icon: DollarSign, color: "text-amber-500" },
    { label: "Active Customers", value: "2,420", trend: "+8.2%", icon: Users, color: "text-blue-500" },
    { label: "New Orders", value: "148", trend: "-2.4%", icon: ShoppingBag, color: "text-purple-500" },
    { label: "Conversion Rate", value: "3.2%", trend: "+1.1%", icon: TrendingUp, color: "text-emerald-500" },
];

const mockSales = [
    { title: "Lumina Lounge Sofa", time: "2 hours ago", amount: "+$2,800" },
    { title: "Cloud Designer Chair", time: "5 hours ago", amount: "+$1,400" },
    { title: "Aura Modular Sofa", time: "1 day ago", amount: "+$2,400" },
    { title: "Zen Designer Lamp", time: "1 day ago", amount: "+$120" },
    { title: "Lumina Lounge Sofa", time: "2 days ago", amount: "+$2,800" },
];

export default function AdminDashboard() {
    const [flagship, setFlagship] = useState<Product | null>(null);

    useEffect(() => {
        const fetchFlagship = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.length > 0) {
                    setFlagship(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch flagship for dashboard:", error);
            }
        };
        fetchFlagship();
    }, []);

    return (
        <div className="flex flex-col gap-10">
            <div>
                <h1 className="text-4xl font-serif italic mb-2">Executive Dashboard</h1>
                <p className="text-white/40 text-sm">Real-time overview of your furniture empire.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={cn(
                                "flex items-center text-[10px] font-bold px-2 py-1 rounded-full",
                                stat.trend.includes("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                            )}>
                                {stat.trend.includes("+") ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="text-2xl font-bold mb-1 tracking-tight">{stat.value}</div>
                        <div className="text-xs text-white/40 uppercase tracking-widest font-medium">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3D Featured Product Widget */}
                <div className="lg:col-span-2 h-[500px] rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-8 left-8 z-10">
                        <h3 className="text-xl font-serif italic mb-1">Featured Asset</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest">{flagship?.name || "Loading..."} • High Performance glTF</p>
                    </div>

                    <div className="w-full h-full relative cursor-move">
                        {flagship && (
                            <Scene cameraPosition={[3, 1, 3]}>
                                <ProductModel
                                    url={flagship.modelUrl}
                                    scale={1.8}
                                    position={[0, -0.5, 0]}
                                />
                            </Scene>
                        )}
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Status</div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-sm font-medium">In Production</span>
                            </div>
                        </div>
                        <button className="bg-white text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors pointer-events-auto">
                            Manage Model
                        </button>
                    </div>
                </div>

                {/* Sales Activity */}
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-8">
                    <h3 className="text-xl font-serif italic">Recent Sales</h3>
                    <div className="flex flex-col gap-6">
                        {mockSales.map((sale, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black p-2">
                                        <Package className="w-full h-full text-white/20" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold">{sale.title}</div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest">{sale.time}</div>
                                </div>
                                <div className="text-sm font-bold text-amber-500">{sale.amount}</div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-auto w-full py-4 rounded-2xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
