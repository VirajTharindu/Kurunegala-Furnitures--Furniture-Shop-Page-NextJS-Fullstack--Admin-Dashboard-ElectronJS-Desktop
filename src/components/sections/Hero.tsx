"use client";

import { useRef, useEffect, useState } from "react";
import Scene from "@/components/canvas/Scene";
import ProductModel from "@/components/models/ProductModel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FrontendProduct } from "@/types/product";
import { useSelectedProduct } from "@/store/selectedProduct";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const modelContainerRef = useRef<HTMLDivElement>(null);
  const { selected: flagship, setSelected } = useSelectedProduct();

  useEffect(() => {
    const fetchFlagship = async () => {
      try {
        const res = await fetch("/api/products?page=1&limit=50");
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          const aura = data.products.find((p: FrontendProduct) =>
            p.name.toLowerCase().includes("aura")
          );
          setSelected(aura || data.products[0]);
        }
      } catch (error) {
        console.error("Failed to fetch flagship product:", error);
      }
    };
    fetchFlagship();

    if (textRef.current) {
      gsap.from(textRef.current.children, {
        y: 100,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
      });
    }

    if (modelContainerRef.current) {
      gsap.to(modelContainerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 200,
        scale: 1.1,
        opacity: 0.5,
      });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[110vh] overflow-hidden flex items-center bg-background transition-colors duration-300"
    >
      {/* Split Content Container */}
      <div className="relative z-50 px-6 md:px-36 w-full flex flex-col lg:flex-row items-center justify-between">
        {/* 1. Left Text */}
        <div
          ref={textRef}
          className="w-full lg:w-1/2 max-w-xl pointer-events-none z-10 mt-24 lg:mt-0"
        >
          <h2 className="text-sm uppercase tracking-[0.3em] text-foreground/80 mb-8 overflow-hidden">
            <span className="block italic opacity-100 font-bold whitespace-nowrap">
              Legacy Craftsmanship meets Future Design
            </span>
          </h2>
          <h1 className="text-7xl md:text-[8.5rem] font-serif font-bold text-foreground leading-none mb-10 tracking-tighter">
            Kurunegala <br />
            <span className="italic">Furnitures</span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-md mt-16 mb-6 leading-relaxed font-sans font-semibold">
            Experience the fusion of decade-long heritage and futuristic
            immersion. Transform your living space with our flagship 3D
            collection.
          </p><br /><br />
          <div className="flex gap-6 pointer-events-auto mt-4">
            <button
              onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
              className="px-12 py-6 bg-accent text-accent-foreground hover:opacity-90 transition-all transform hover:scale-105 rounded-full text-sm font-black shadow-2xl">
              Explore Collection
            </button>
            <button
              onClick={() => document.getElementById("configurator")?.scrollIntoView({ behavior: "smooth" })}
              className="px-12 py-6 border-4 border-accent text-foreground hover:bg-surface-hover transition-all transform hover:scale-105 rounded-full text-sm font-black shadow-lg">
              3D Configurator
            </button>
          </div>
        </div>

        {/* 2. Right 3D Model Layer */}
        <div
          ref={modelContainerRef}
          className="w-full lg:w-1/2 h-[50vh] lg:h-[80vh] relative pointer-events-auto mt-12 lg:mt-0"
        >
          <Scene
            cameraPosition={[0, 0, 5]}
            enableControls={false}
            shadowPosition={[0, -0.6, 0]}
          >
            {flagship && (
              <ProductModel
                url={flagship.modelUrl}
                scale={1.4}
                position={[0, -0.6, 0]}
                float={true}
              />
            )}
          </Scene>
        </div>
      </div>

      {/* 3. Floating Detail Layer */}
      <div className="absolute bottom-10 left-16 z-50 flex gap-10 text-xs tracking-widest text-foreground/80 uppercase font-black">
        <div className="flex flex-col gap-2">
          <span className="opacity-100">01 / 04</span>
          <div className="w-24 h-1 bg-border-strong overflow-hidden rounded-full">
            <div className="w-1/3 h-full bg-accent rounded-full" />
          </div>
        </div>
        <div className="opacity-100">Scroll to Explore</div>
      </div>
    </section >
  );
}
