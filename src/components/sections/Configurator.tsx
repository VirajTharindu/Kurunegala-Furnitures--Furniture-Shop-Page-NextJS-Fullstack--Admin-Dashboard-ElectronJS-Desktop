import { useConfigurator } from "@/hooks/useConfigurator";
import { cn } from "@/lib/utils";
import Scene from "@/components/canvas/Scene";
import ProductModel from "@/components/models/ProductModel";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Product } from "@/lib/db";
import * as d3 from "d3";

const colors = [
    { name: "Slate", value: "#4A4A4A" },
    { name: "Cream", value: "#F5F5DC" },
    { name: "Navy", value: "#1A2E44" },
    { name: "Terracotta", value: "#A0522D" },
    { name: "Forest", value: "#2D4A3E" },
];

const materials = [
    { id: "fabric", name: "Textured Fabric" },
    { id: "leather", name: "Genuine Leather" },
    { id: "velvet", name: "Royal Velvet" },
] as const;

type ConfigTab = "appearance" | "dimensions";

export default function ConfiguratorSection() {
    const { color, setColor, material, setMaterial, width, height, depth, setDimensions } = useConfigurator();
    const [activeTab, setActiveTab] = useState<ConfigTab>("appearance");
    const [flagship, setFlagship] = useState<Product | null>(null);
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const fetchFlagship = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.length > 0) {
                    setFlagship(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch products for configurator:", error);
            }
        };
        fetchFlagship();
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        const data = [
            { label: "Width", value: width, max: 300 },
            { label: "Height", value: height, max: 120 },
            { label: "Depth", value: depth, max: 150 },
        ];

        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 10, right: 10, bottom: 20, left: 40 };
        const w = 300 - margin.left - margin.right;
        const h = 150 - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .range([0, w])
            .domain(data.map(d => d.label))
            .padding(0.4);

        const y = d3.scaleLinear()
            .range([h, 0])
            .domain([0, 300]);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.label) || 0)
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.value))
            .attr("height", d => h - y(d.value))
            .attr("fill", "#111111")
            .attr("rx", 4);

        g.append("g")
            .attr("transform", `translate(0,${h})`)
            .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
            .call(g => g.select(".domain").remove());

    }, [width, height, depth]);

    return (
        <section className="w-full min-h-screen bg-white flex flex-col md:flex-row items-stretch border-t border-gray-100">
            {/* Left side: Selection Controls */}
            <div className="w-full md:w-2/5 p-8 md:p-20 flex flex-col gap-12 border-r border-gray-100">
                <div>
                    <h2 className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-2">Bespoke</h2>
                    <h1 className="text-5xl md:text-7xl font-serif font-light text-gray-900 italic">Configurator</h1>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-8 border-b border-gray-100 pb-4">
                    {(["appearance", "dimensions"] as ConfigTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "text-xs uppercase tracking-widest font-bold transition-all relative",
                                activeTab === tab ? "text-gray-900" : "text-gray-300 hover:text-gray-500"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="tab-underline" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gray-900" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === "appearance" ? (
                            <motion.div
                                key="appearance"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex flex-col gap-12"
                            >
                                {/* Color Selection */}
                                <div className="flex flex-col gap-6">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Hue</label>
                                    <div className="flex flex-wrap gap-4">
                                        {colors.map((c) => (
                                            <button
                                                key={c.value}
                                                onClick={() => setColor(c.value)}
                                                className={cn(
                                                    "w-10 h-10 rounded-full border-2 transition-all p-1",
                                                    color === c.value ? "border-gray-900 scale-110" : "border-transparent hover:border-gray-200"
                                                )}
                                            >
                                                <div className="w-full h-full rounded-full" style={{ backgroundColor: c.value }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Material Selection */}
                                <div className="flex flex-col gap-6">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Textile</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {materials.map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setMaterial(m.id)}
                                                className={cn(
                                                    "px-6 py-4 border rounded-xl text-left transition-all flex justify-between items-center",
                                                    material === m.id
                                                        ? "border-gray-900 bg-gray-50 text-gray-900"
                                                        : "border-gray-200 hover:border-gray-400 text-gray-400"
                                                )}
                                            >
                                                <span className="text-sm font-medium">{m.name}</span>
                                                {material === m.id && <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="dimensions"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex flex-col gap-12"
                            >
                                <div className="flex flex-col gap-8">
                                    {[
                                        { label: "Width (cm)", key: "width", value: width, min: 180, max: 300 },
                                        { label: "Height (cm)", key: "height", value: height, min: 70, max: 120 },
                                        { label: "Depth (cm)", key: "depth", value: depth, min: 80, max: 150 },
                                    ].map((dim) => (
                                        <div key={dim.key} className="flex flex-col gap-4">
                                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                                                <span>{dim.label}</span>
                                                <span>{dim.value}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={dim.min}
                                                max={dim.max}
                                                value={dim.value}
                                                onChange={(e) => setDimensions({ [dim.key]: parseInt(e.target.value) })}
                                                className="w-full accent-gray-900 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* D3 Spec Chart */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-bold">Live Specifications Map</h3>
                                    <svg ref={chartRef} width="300" height="150" className="mx-auto" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right side: Large 3D Display */}
            <div className="w-full md:w-3/5 relative bg-[#FAFAFA] flex items-center justify-center min-h-[600px]">
                <Scene cameraPosition={[5, 2, 5]}>
                    {flagship && (
                        <ProductModel
                            url={flagship.modelUrl}
                            scale={2.5}
                            position={[0, -0.8, 0]}
                        />
                    )}
                </Scene>

                {/* Info Hud */}
                <div className="absolute bottom-12 right-12 text-right pointer-events-none">
                    <div className="text-xs tracking-[0.4em] text-gray-300 uppercase mb-2 italic">{flagship?.name || "Aura Collection"}</div>
                    <div className="text-4xl font-serif text-gray-900 italic">2024 Edition</div>
                </div>
            </div>
        </section>
    );
}
