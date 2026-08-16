import { create } from "zustand";
import { FrontendProduct } from "@/types/product";

interface SelectedProductState {
  selected: FrontendProduct | null;
  setSelected: (product: FrontendProduct | null) => void;
}

export const useSelectedProduct = create<SelectedProductState>((set) => ({
  selected: null,
  setSelected: (product) => set({ selected: product }),
}));
