"use client";

import { useState, useEffect } from "react";
import Scene from "@/components/canvas/Scene";
import ProductModel from "@/components/models/ProductModel";
import { AnimatePresence, useSpring, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FrontendProduct } from "@/types/product";
import { useSelectedProduct } from "@/store/selectedProduct";

export default function Categories() {
    const [products, setProducts] = useState<FrontendProduct[]>([]);
    const { selected, setSelected } = useSelectedProduct();
    const [loading, setLoading] = useState(true);
    const progress = useSpring(0, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                const items = Array.isArray(data.products) ? data.products : [];
                setProducts(items);
                if (items.length > 0) {
                    setSelected(items[0]);
                }
            } catch (error) {
                console.error("Failed to fetch products for categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!selected || products.length === 0) return;
        const index = products.findIndex(c => c.id === selected.id);
        progress.set(index / (products.length - 1));
    }, [selected, progress, products]);

    if (loading || products.length === 0) return (
        <section className="w-full h-screen bg-surface transition-colors duration-300" />
    );

    return (
        <section id="categories" className="relative w-full min-h-screen bg-surface flex flex-col md:flex-row items-center justify-between px-6 md:px-24 py-32 overflow-hidden select-none transition-colors duration-300">
            {/* Liquid Background Effect Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" style={{ filter: 'blur(80px)' }}>
                <circle cx="10%" cy="20%" r="300" fill="var(--liquid-a)" />
                <circle cx="90%" cy="80%" r="400" fill="var(--liquid-b)" />
            </svg>

            {/* Left side: Text Info */}
            <div className="w-full md:w-2/5 z-10">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-xs uppercase tracking-[0.5em] text-muted mb-12 font-medium"
                >
                    Curated Collections
                </motion.h2>

                <div className="flex flex-col gap-4">
                    {products.map((cat, idx) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelected(cat)}
                            className={cn(
                                "relative text-left transition-all duration-700 group flex items-baseline gap-6",
                                selected?.id === cat.id ? "opacity-100" : "opacity-20 hover:opacity-40"
                            )}
                        >
                            <span className="text-12 md:text-16 font-serif text-muted pointer-events-none">0{idx + 1}</span>
                            <span className={cn(
                                "text-5xl md:text-8xl font-serif font-light block transition-all tracking-tighter text-foreground",
                                selected?.id === cat.id ? "italic translate-x-4" : ""
                            )}>
                                {cat.name}
                            </span>

                            {selected?.id === cat.id && (
                                <motion.div
                                    layoutId="liquid-pill"
                                    className="absolute -left-8 top-1/2 -translate-y-1/2 w-2 h-16 bg-accent rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-16 h-32 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {selected && (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-sm"
                            >
                                <p className="text-lg text-muted leading-relaxed font-sans mb-4">
                                    {selected.description}
                                </p>
                                <span className="text-xs uppercase tracking-widest text-muted font-bold">
                                    {selected.specs.material || "Premium Selection"} • {selected.specs.width}cm
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right: 3D Visualization */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] relative mt-12 md:mt-0 flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        {selected && (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 1.1, rotate: 10 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full h-full"
                            >
                                <Scene cameraPosition={[4, 4, 4]} enableControls={true}>
                                    <ProductModel
                                        url={selected.modelUrl}
                                        scale={selected.category === 'Chairs' ? 1.4 : 1.8}
                                        position={[0, -0.2, 0]}
                                    />
                                </Scene>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-surface-hover to-transparent opacity-50 -z-10" />
            </div>

            {/* Vertical Progress Indicator */}
            <div className="hidden md:block absolute left-12 top-1/2 -translate-y-1/2 h-64 w-px bg-border mt-20">
                <motion.div
                    className="w-full bg-accent origin-top"
                    style={{ height: "100%", scaleY: progress }}
                />
            </div>
        </section>
    );
}
