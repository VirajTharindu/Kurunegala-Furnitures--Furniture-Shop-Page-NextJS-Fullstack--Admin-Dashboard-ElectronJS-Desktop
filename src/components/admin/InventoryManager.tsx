"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, Loader2, X } from "lucide-react";
import Scene from "@/components/canvas/Scene";
import ProductModel from "@/components/models/ProductModel";
import { FrontendProduct } from "@/types/product";
import { cn } from "@/lib/utils";

export default function InventoryManager() {
    const [products, setProducts] = useState<FrontendProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<FrontendProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<FrontendProduct> | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isNewAsset, setIsNewAsset] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            const items = data.products || [];
            setProducts(items);
            if (items.length > 0 && !selectedProduct) {
                setSelectedProduct(items[0]);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                const nextProducts = products.filter(p => p.id !== id);
                setProducts(nextProducts);
                if (selectedProduct?.id === id) {
                    setSelectedProduct(nextProducts[0] || null);
                }
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const isUpdate = editingProduct?.id && !isNewAsset;
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/products/${editingProduct.id}` : "/api/products";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingProduct),
            });
            if (res.ok) {
                await fetchProducts();
                setIsModalOpen(false);
                setEditingProduct(null);
            }
        } catch (error) {
            console.error("Failed to save product:", error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="dark h-full">
            <div className="flex flex-col gap-8 h-full relative p-8 bg-background text-foreground transition-colors">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-serif italic mb-2">Inventory Control</h1>
                        <p className="text-muted text-sm">Manage assets and catalog items across all regions.</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsNewAsset(true);
                            setEditingProduct({
                                id: Math.random().toString(36).substr(2, 9),
                                name: "",
                                category: "Sofas",
                                price: 0,
                                description: "",
                                availability: "In Stock",
                                modelUrl: "",
                                tags: [],
                                specs: { width: 0, height: 0, depth: 0, weight: 0, material: "" }
                            });
                            setIsModalOpen(true);
                        }}
                        className="bg-amber-500 text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Product
                    </button>
                </div>

                <div className="flex gap-8 flex-1 min-h-0">
                    {/* Product List */}
                    <div className="w-2/3 flex flex-col gap-4 overflow-y-auto pr-4 custom-scrollbar">
                        <div className="flex gap-4 mb-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-white/20 text-white"
                                />
                            </div>
                            <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                                <motion.div
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={cn(
                                        "p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-6 group",
                                        selectedProduct?.id === product.id
                                            ? "bg-amber-500/10 border-amber-500/50"
                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                    )}
                                >
                                    <div className="w-20 h-20 rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center relative bg-linear-to-br from-gray-900 to-black">
                                        <PackageIcon className="w-8 h-8 text-white/10" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-lg font-bold mb-1">{product.name}</div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest">{product.category}</span>
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                                product.availability === "In Stock" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                            )}>
                                                {product.availability}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-amber-500">${product.price}</div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-widest">SKU: {product.id.toUpperCase()}</div>
                                    </div>
                                    <button className="p-2 text-white/20 hover:text-white transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* 3D Preview & Details */}
                    <div className="w-1/3 flex flex-col gap-6">
                        <div className="h-80 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                            {selectedProduct && (
                                <div className="w-full h-full">
                                    <Scene key={selectedProduct.id} cameraPosition={[3, 1, 3]}>
                                        <ProductModel
                                            url={selectedProduct.modelUrl}
                                            scale={2}
                                            position={[0, -0.5, 0]}
                                        />
                                    </Scene>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="p-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold tracking-tight">{selectedProduct?.name}</h3>
                                <button
                                    onClick={() => {
                                        setIsNewAsset(false);
                                        setEditingProduct(selectedProduct);
                                        setIsModalOpen(true);
                                    }}
                                    className="text-amber-500 hover:text-amber-400"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Dimensions</div>
                                    <div className="text-sm font-medium">{selectedProduct?.specs.width} x {selectedProduct?.specs.height} x {selectedProduct?.specs.depth} cm</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Weight</div>
                                    <div className="text-sm font-medium">{selectedProduct?.specs.weight} kg</div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex-1">
                                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">Catalog Description</div>
                                <p className="text-sm text-white/60 leading-relaxed font-light italic">
                                    "{selectedProduct?.description}"
                                </p>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <button className="flex-1 py-3 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors">
                                    Update Listing
                                </button>
                                <button
                                    onClick={() => selectedProduct && handleDelete(selectedProduct.id)}
                                    disabled={actionLoading}
                                    className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/20 disabled:opacity-50"
                                >
                                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Management Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                                    <h2 className="text-2xl font-serif italic">{isNewAsset ? "New Collection Asset" : "Edit Asset"}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="p-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Product Name</label>
                                            <input
                                                required
                                                value={editingProduct?.name || ""}
                                                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-amber-500 outline-none"
                                                placeholder="e.g. Aura Lounge Chair"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40">Price (USD)</label>
                                            <input
                                                required
                                                type="number"
                                                value={editingProduct?.price || ""}
                                                onChange={e => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) })}
                                                className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-amber-500 outline-none"
                                                placeholder="2400"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">3D Model URL (GLB)</label>
                                        <input
                                            required
                                            value={editingProduct?.modelUrl || ""}
                                            onChange={e => setEditingProduct({ ...editingProduct, modelUrl: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-amber-500 outline-none font-mono"
                                            placeholder="https://.../model.glb"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40">Description</label>
                                        <textarea
                                            rows={3}
                                            value={editingProduct?.description || ""}
                                            onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-amber-500 outline-none resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { label: "W (cm)", key: "width" },
                                            { label: "H (cm)", key: "height" },
                                            { label: "D (cm)", key: "depth" },
                                            { label: "Kg", key: "weight" },
                                        ].map(spec => (
                                            <div key={spec.key} className="flex flex-col gap-2">
                                                <label className="text-[10px] uppercase tracking-widest text-white/40">{spec.label}</label>
                                                <input
                                                    type="number"
                                                    value={(editingProduct?.specs as any)?.[spec.key] || ""}
                                                    onChange={e => setEditingProduct({
                                                        ...editingProduct,
                                                        specs: { ...editingProduct?.specs, [spec.key]: parseInt(e.target.value) } as any
                                                    })}
                                                    className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-amber-500 outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="mt-4 w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save to Global Inventory"}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function PackageIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    )
}
