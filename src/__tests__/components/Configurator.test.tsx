import { render, screen, fireEvent } from "@testing-library/react";
import ConfiguratorSection from "@/components/sections/Configurator";
import { useSession } from "next-auth/react";
import { useSelectedProduct } from "@/store/selectedProduct";
import { useConfigurator } from "@/hooks/useConfigurator";

// Mock next-auth
jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
}));

// Mock Zustand stores
jest.mock("@/store/selectedProduct", () => ({
    useSelectedProduct: jest.fn(),
}));

jest.mock("@/hooks/useConfigurator", () => ({
    useConfigurator: jest.fn(),
}));

// Mock Three.js / Canvas to prevent WebGL errors in JSDOM
jest.mock("@/components/canvas/Scene", () => {
    return function DummyScene({ children }: any) {
        return <div data-testid="scene-mock">{children}</div>;
    };
});
jest.mock("@/components/models/ProductModel", () => {
    return function DummyProductModel() {
        return <div data-testid="product-model-mock"></div>;
    };
});

describe("ConfiguratorSection Component", () => {
    const mockUseSession = useSession as jest.Mock;
    const mockUseSelectedProduct = useSelectedProduct as unknown as jest.Mock;
    const mockUseConfigurator = useConfigurator as unknown as jest.Mock;

    beforeEach(() => {
        mockUseSession.mockReturnValue({ data: null });
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
        
        // Mock alert for Add to Cart
        window.alert = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the configurator controls and 3D scene mock", () => {
        render(<ConfiguratorSection />);
        
        expect(screen.getByTestId("scene-mock")).toBeInTheDocument();
        expect(screen.getByTestId("product-model-mock")).toBeInTheDocument();
        
        // Verify tabs are present
        expect(screen.getByText(/Appearance/i)).toBeInTheDocument();
        expect(screen.getByText(/Dimensions/i)).toBeInTheDocument();
    });

    it("shows unauthenticated message when user is not logged in", () => {
        render(<ConfiguratorSection />);
        expect(screen.getByText(/Sign in required to save configuration/i)).toBeInTheDocument();
        
        const addToCartBtn = screen.getByRole("button", { name: /Add to Cart/i });
        fireEvent.click(addToCartBtn);
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Please log in"));
    });

    it("allows adding to cart when authenticated", () => {
        mockUseSession.mockReturnValue({ data: { user: { name: "Test" } } });
        render(<ConfiguratorSection />);
        
        expect(screen.queryByText(/Sign in required/i)).not.toBeInTheDocument();
        
        const addToCartBtn = screen.getByRole("button", { name: /Add to Cart/i });
        fireEvent.click(addToCartBtn);
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Added to cart"));
    });
});
