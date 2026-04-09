import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

// Mock the AuthContext so we can control useAuth's return value
vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('Header Component', () => {
    // Clear mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the CreatorHub logo and Home link', () => {
        // Setup mock for unauthenticated user
        useAuth.mockReturnValue({
            isAuthenticated: () => false,
            user: null,
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        // Uses getByText and getByRole
        expect(screen.getByText('CreatorHub')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    });

    it('shows Login and Register links when the user is not authenticated', () => {
        useAuth.mockReturnValue({
            isAuthenticated: () => false,
            user: null,
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });

    it('shows Dashboard link, user greeting, and Logout button when authenticated', () => {
        useAuth.mockReturnValue({
            isAuthenticated: () => true,
            user: { name: 'Alice' },
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
        expect(screen.getByText(/hi, alice/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

        // Assert Login and Register are NOT shown
        expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /register/i })).not.toBeInTheDocument();
    });

    it('calls the logout function when the Logout button is clicked', async () => {
        const mockLogout = vi.fn();
        useAuth.mockReturnValue({
            isAuthenticated: () => true,
            user: { name: 'Alice' },
            logout: mockLogout,
        });

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        await user.click(logoutButton);

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});
