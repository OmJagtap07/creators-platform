import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm — interaction tests', () => {

    it('allows the user to type into the email field', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={jest.fn()} />);

        await user.type(screen.getByLabelText(/email/i), 'alice@example.com');

        expect(screen.getByLabelText(/email/i)).toHaveValue('alice@example.com');
    });

    it('allows the user to type into the password field', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={jest.fn()} />);

        await user.type(screen.getByLabelText(/password/i), 'supersecret');

        expect(screen.getByLabelText(/password/i)).toHaveValue('supersecret');
    });

    it('calls onSubmit with email and password when the form is submitted', async () => {
        const mockSubmit = jest.fn();
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockSubmit} />);

        await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
        await user.type(screen.getByLabelText(/password/i), 'supersecret');
        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        expect(mockSubmit).toHaveBeenCalledWith({
            email: 'alice@example.com',
            password: 'supersecret',
        });
    });

    it('shows an error and does not call onSubmit when fields are empty', async () => {
        const mockSubmit = jest.fn();
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockSubmit} />);

        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(screen.getByRole('alert'))
            .toHaveTextContent(/both fields are required/i);
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('shows an error when only the email is filled in', async () => {
        const mockSubmit = jest.fn();
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockSubmit} />);

        await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
    });

});
