"use client";

import { create } from "zustand";

interface ConfiguratorState {
    color: string;
    material: "fabric" | "leather" | "velvet";
    width: number;
    height: number;
    depth: number;
    setColor: (color: string) => void;
    setMaterial: (material: "fabric" | "leather" | "velvet") => void;
    setDimensions: (dims: { width?: number; height?: number; depth?: number }) => void;
}

export const useConfigurator = create<ConfiguratorState>((set) => ({
    color: "#4A4A4A",
    material: "fabric",
    width: 240,
    height: 85,
    depth: 100,
    setColor: (color) => set({ color }),
    setMaterial: (material) => set({ material }),
    setDimensions: (dims) => set((state) => ({ ...state, ...dims })),
}));
