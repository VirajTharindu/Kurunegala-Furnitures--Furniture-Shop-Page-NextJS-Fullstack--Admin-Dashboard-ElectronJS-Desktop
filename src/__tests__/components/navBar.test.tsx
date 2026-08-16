import { render, screen } from '@testing-library/react';
import Navbar from '@/components/ui/Navbar';

// mock next-auth/react
jest.mock('next-auth/react', () => ({
    useSession: () => ({
        data: null,
        status: 'unauthenticated'
    }),
    signOut: jest.fn()
}));

// mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
    usePathname: () => '/',
}));

describe('Navbar', () => {
    it('renders the navigation and brand title', () => {
        render(<Navbar />);
        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Kurunegala/i })).toBeInTheDocument();
    });

    it('shows login link when unauthenticated', () => {
        render(<Navbar />);
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    it('renders collections and menu buttons', () => {
        render(<Navbar />);
        expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /collections/i })).toBeInTheDocument();
    });
});
