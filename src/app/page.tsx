"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Footer from "@/components/sections/Footer";

const Hero = dynamic(() => import("@/components/sections/Hero"), { ssr: false });
const Categories = dynamic(() => import("@/components/sections/Categories"), { ssr: false });
const Configurator = dynamic(() => import("@/components/sections/Configurator"), { ssr: false });
const RoomVisualizer = dynamic(() => import("@/components/sections/RoomVisualizer"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <LoadingScreen />
      <CustomCursor />
      <Navbar />

      <Hero />
      <Categories />
      <Configurator />
      <RoomVisualizer />

      <Footer />
    </main>
  );
}
