"use client";

export default function Footer() {
    return (
        <footer className="w-full py-20 px-10 bg-background border-t border-border flex flex-col md:flex-row justify-between items-start gap-12 transition-colors duration-300">
            <div className="flex flex-col gap-6 max-w-sm">
                <h2 className="text-3xl font-serif italic text-foreground">Kurunegala.</h2>
                <p className="text-sm text-muted leading-relaxed font-sans">
                    Continuing a decade of excellence in furniture design.
                    Bringing the future of interior design to your fingertips.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Explore</span>
                    <button className="text-sm text-left text-foreground/80 hover:italic transition-all">Collections</button>
                    <button className="text-sm text-left text-foreground/80 hover:italic transition-all">3D Experience</button>
                    <button className="text-sm text-left text-foreground/80 hover:italic transition-all">Customization</button>
                </div>
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Company</span>
                    <button className="text-sm text-left text-foreground/80 hover:italic transition-all">Heritage</button>
                    <button className="text-sm text-left text-foreground/80 hover:italic transition-all">Craftsmanship</button>
                    <button className="text-sm text-left text-foreground/80 hover:italic transition-all">Contact</button>
                </div>
            </div>

            <div className="flex flex-col gap-4 text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted">© 2024 Kurunegala Furnitures</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Sri Lanka • Worldwide</p>
            </div>
        </footer>
    );
}
