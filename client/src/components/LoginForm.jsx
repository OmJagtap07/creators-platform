import { useState } from 'react';

const LoginForm = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Both fields are required.');
            return;
        }
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p role="alert">{error}</p>}
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
