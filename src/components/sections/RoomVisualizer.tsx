import { useState, Suspense, useEffect } from "react";
import Scene from "@/components/canvas/Scene";
import ProductModel from "@/components/models/ProductModel";
import { Environment, MeshReflectorMaterial, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/db";

type RoomType = "modern-living" | "industrial-loft" | "scandinavian-studio" | "luxury-suite";
type PresetType = "city" | "warehouse" | "apartment" | "lobby";

const rooms: { id: RoomType; name: string; preset: PresetType; description: string; colors: string[] }[] = [
    {
        id: "modern-living",
        name: "Modern Living",
        preset: "city",
        description: "A clean, airy space with ample natural light. Perfect for showcasing the minimalistic lines of the Aura collection.",
        colors: ["#FFFFFF", "#F3F4F6"]
    },
    {
        id: "industrial-loft",
        name: "Industrial Loft",
        preset: "warehouse",
        description: "Raw textures and exposed elements. The organic warmth of our furniture provides a striking contrast to the industrial backdrop.",
        colors: ["#374151", "#1F2937"]
    },
    {
        id: "scandinavian-studio",
        name: "Scandinavian Studio",
        preset: "apartment",
        description: "Functional beauty at its best. Neutral tones and natural materials create a serene sanctuary of calm.",
        colors: ["#F9FAFB", "#E5E7EB"]
    },
    {
        id: "luxury-suite",
        name: "Luxury Suite",
        preset: "lobby",
        description: "Unapologetic opulence. Deep tones and rich textures highlight the premium Italian leather of our flagship pieces.",
        colors: ["#111827", "#000000"]
    },
];

export default function RoomVisualizer() {
    const [activeRoom, setActiveRoom] = useState(rooms[0]);
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
                console.error("Failed to fetch products for room visualizer:", error);
            }
        };
        fetchFlagship();
    }, []);

    return (
        <section className="w-full min-h-screen bg-[#050505] overflow-hidden relative flex flex-col items-center justify-center py-32">
            <div className="z-10 text-center mb-20 max-w-2xl px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[10px] uppercase tracking-[0.5em] text-gray-500 mb-6 font-bold"
                >
                    Atmospheric Context
                </motion.h2>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-serif text-white italic mb-8"
                >
                    Visualize in Room
                </motion.h1>
                <motion.p
                    key={activeRoom.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-400 text-lg leading-relaxed font-sans"
                >
                    {activeRoom.description}
                </motion.p>
            </div>

            <div className="w-full h-[65vh] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeRoom.id}
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="w-full h-full"
                    >
                        <Scene cameraPosition={[6, 3, 6]} enableControls={true}>
                            <Environment preset={activeRoom.preset} />

                            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                                {flagship && (
                                    <ProductModel
                                        url={flagship.modelUrl}
                                        scale={2.2}
                                        position={[0, -0.6, 0]}
                                    />
                                )}
                            </Float>

                            {/* Premium Reflector Floor */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.61, 0]}>
                                <planeGeometry args={[50, 50]} />
                                <MeshReflectorMaterial
                                    blur={[300, 100]}
                                    resolution={2048}
                                    mixBlur={1}
                                    mixStrength={40}
                                    roughness={1}
                                    depthScale={1.2}
                                    minDepthThreshold={0.4}
                                    maxDepthThreshold={1.4}
                                    color="#101010"
                                    metalness={0.5}
                                    mirror={0}
                                />
                            </mesh>

                            <gridHelper args={[50, 50, 0x222222, 0x111111]} position={[0, -0.605, 0]} />
                        </Scene>
                    </motion.div>
                </AnimatePresence>

                {/* Room Switcher HUD */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 bg-white/5 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl">
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => setActiveRoom(room)}
                            className={cn(
                                "px-8 py-4 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all font-bold",
                                activeRoom.id === room.id
                                    ? "bg-white text-gray-900 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {room.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Decorative Perspective Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
            </div>
        </section>
    );
}
