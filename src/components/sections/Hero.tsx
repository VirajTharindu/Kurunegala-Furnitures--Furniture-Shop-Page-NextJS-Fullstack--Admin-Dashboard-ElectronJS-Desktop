"use client";

import { useRef, useEffect, useState } from "react";
import Scene from "@/components/canvas/Scene";
import ProductModel from "@/components/models/ProductModel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BackgroundShader from "@/components/canvas/BackgroundShader";
import { Product } from "@/lib/db";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const modelContainerRef = useRef<HTMLDivElement>(null);
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
                console.error("Failed to fetch flagship product:", error);
            }
        };
        fetchFlagship();

        if (textRef.current) {
            gsap.from(textRef.current.children, {
                y: 100,
                opacity: 0,
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
                scale: 1.2,
                opacity: 0.5,
            });
        }
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-white">
            {/* 3D Scene Layer */}
            <div ref={modelContainerRef} className="absolute inset-0 z-0">
                <Scene cameraPosition={[0, 0, 5]} enableControls={false}>
                    <BackgroundShader />
                    {flagship && (
                        <ProductModel
                            url={flagship.modelUrl}
                            scale={2.5}
                            position={[0, -0.6, 0]}
                            float={true}
                        />
                    )}
                </Scene>
            </div>

            {/* UI Layer */}
            <div className="relative z-10 container mx-auto px-6 pointer-events-none">
                <div ref={textRef} className="max-w-3xl">
                    <h2 className="text-sm uppercase tracking-[0.4em] text-gray-400 mb-4 overflow-hidden">
                        <span className="block italic">Legacy Craftsmanship meets Future Design</span>
                    </h2>
                    <h1 className="text-7xl md:text-[10rem] font-serif font-light text-gray-900 leading-none mb-8 tracking-tighter">
                        Kurunegala <br />
                        <span className="italic">Furnitures</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-md mb-12 leading-relaxed font-sans">
                        Experience the fusion of decade-long heritage and futuristic immersion.
                        Transform your living space with our flagship 3D collection.
                    </p>
                    <div className="flex gap-6 pointer-events-auto">
                        <button className="px-8 py-4 bg-gray-900 text-white hover:bg-black transition-colors rounded-full text-sm font-medium">
                            Explore Collection
                        </button>
                        <button className="px-8 py-4 border border-gray-200 text-gray-900 hover:border-gray-900 transition-colors rounded-full text-sm font-medium">
                            3D Configurator
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Indicators */}
            <div className="absolute bottom-10 left-10 flex gap-10 text-xs tracking-widest text-gray-400 uppercase">
                <div className="flex flex-col gap-2">
                    <span>01 / 04</span>
                    <div className="w-20 h-px bg-gray-200 overflow-hidden">
                        <div className="w-1/4 h-full bg-gray-900" />
                    </div>
                </div>
                <div>Rotate to Explore</div>
            </div>
        </section>
    );
}
