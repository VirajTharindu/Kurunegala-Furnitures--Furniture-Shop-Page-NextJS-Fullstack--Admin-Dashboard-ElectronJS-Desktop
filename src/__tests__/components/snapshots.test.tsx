/**
 * Snapshot Tests
 *
 * Captures the rendered HTML structure of key UI components so that
 * any accidental visual/structural regressions are caught on the next run.
 *
 * To intentionally update snapshots after a purposeful UI change, run:
 *   npx jest --updateSnapshot
 */

import { render } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useSelectedProduct } from "@/store/selectedProduct";
import { useConfigurator } from "@/hooks/useConfigurator";

// ─── Global mocks ────────────────────────────────────────────────────────────

jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
    usePathname: () => "/",
}));

// next-themes: start mounted so ThemeToggle renders fully
jest.mock("next-themes", () => ({
    useTheme: () => ({ theme: "dark", setTheme: jest.fn() }),
}));

// framer-motion: strip all Framer-specific props so they don't leak to DOM elements
jest.mock("framer-motion", () => {
    const React = require("react");

    // All props that framer-motion uses but are invalid on real DOM elements
    const FRAMER_PROPS = new Set([
        "initial", "animate", "exit", "transition", "variants",
        "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView",
        "layoutId", "layout", "layoutDependency",
        "drag", "dragConstraints", "dragElastic", "dragMomentum",
        "onAnimationStart", "onAnimationComplete",
        "style", // keep native style but strip motion values if needed
    ]);

    const makeProxy = (tag: string) =>
        // eslint-disable-next-line react/display-name
        React.forwardRef(({ children, ...props }: any, ref: any) => {
            const domProps: Record<string, any> = {};
            for (const [key, val] of Object.entries(props)) {
                if (!FRAMER_PROPS.has(key)) domProps[key] = val;
            }
            // Always allow style through
            if (props.style) domProps.style = props.style;
            return React.createElement(tag, { ...domProps, ref }, children);
        });

    return {
        motion: {
            div: makeProxy("div"),
            nav: makeProxy("nav"),
            h1: makeProxy("h1"),
            button: makeProxy("button"),
            span: makeProxy("span"),
            section: makeProxy("section"),
            ul: makeProxy("ul"),
            li: makeProxy("li"),
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
        useScroll: () => ({
            scrollY: { getPrevious: () => 0, on: jest.fn(), get: () => 0 },
        }),
        useMotionValueEvent: jest.fn(),
    };
});

// Zustand stores (Configurator)
jest.mock("@/store/selectedProduct", () => ({
    useSelectedProduct: jest.fn(),
}));
jest.mock("@/hooks/useConfigurator", () => ({
    useConfigurator: jest.fn(),
}));

// Three.js / WebGL canvas (Configurator)
jest.mock("@/components/canvas/Scene", () => ({
    __esModule: true,
    default: ({ children }: any) => <div data-testid="scene-mock">{children}</div>,
}));
jest.mock("@/components/models/ProductModel", () => ({
    __esModule: true,
    default: () => <div data-testid="product-model-mock" />,
}));

// ─── Imports (after mocks) ───────────────────────────────────────────────────

import Navbar from "@/components/ui/Navbar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ConfiguratorSection from "@/components/sections/Configurator";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockUseSession = useSession as jest.Mock;
const mockUseSelectedProduct = useSelectedProduct as unknown as jest.Mock;
const mockUseConfigurator = useConfigurator as unknown as jest.Mock;

const defaultConfiguratorMocks = () => {
    mockUseSelectedProduct.mockReturnValue({
        selected: { id: "1", name: "Aura Chair", modelUrl: "/models/chair.glb" },
        setSelected: jest.fn(),
    });
    mockUseConfigurator.mockReturnValue({
        color: "#4A4A4A",
        setColor: jest.fn(),
        material: "fabric",
        setMaterial: jest.fn(),
        width: 100,
        height: 100,
        depth: 100,
        setDimensions: jest.fn(),
    });
    window.alert = jest.fn();
};

// ─── Navbar Snapshots ────────────────────────────────────────────────────────

describe("Navbar — snapshots", () => {
    afterEach(() => jest.clearAllMocks());

    it("matches snapshot when unauthenticated", () => {
        mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
        const { asFragment } = render(<Navbar />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when authenticated as a regular user", () => {
        mockUseSession.mockReturnValue({
            data: { user: { name: "Viraj", email: "viraj@example.com", role: "USER" } },
            status: "authenticated",
        });
        const { asFragment } = render(<Navbar />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when authenticated as an admin", () => {
        mockUseSession.mockReturnValue({
            data: { user: { name: "Admin", email: "admin@example.com", role: "ADMIN" } },
            status: "authenticated",
        });
        const { asFragment } = render(<Navbar />);
        expect(asFragment()).toMatchSnapshot();
    });
});

// ─── ThemeToggle Snapshots ────────────────────────────────────────────────────

describe("ThemeToggle — snapshots", () => {
    it("matches snapshot in dark mode", () => {
        const { asFragment } = render(<ThemeToggle />);
        expect(asFragment()).toMatchSnapshot();
    });
});

// ─── ConfiguratorSection Snapshots ───────────────────────────────────────────

describe("ConfiguratorSection — snapshots", () => {
    beforeEach(() => {
        defaultConfiguratorMocks();
    });
    afterEach(() => jest.clearAllMocks());

    it("matches snapshot when unauthenticated (shows sign-in prompt)", () => {
        mockUseSession.mockReturnValue({ data: null });
        const { asFragment } = render(<ConfiguratorSection />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when authenticated (hides sign-in prompt)", () => {
        mockUseSession.mockReturnValue({
            data: { user: { name: "Viraj" } },
        });
        const { asFragment } = render(<ConfiguratorSection />);
        expect(asFragment()).toMatchSnapshot();
    });
});
