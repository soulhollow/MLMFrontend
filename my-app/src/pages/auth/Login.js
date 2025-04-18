// src/pages/auth/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// CSS-Imports werden bereits zentral geladen

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const success = await login(email, password);

        setIsLoading(false);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Anmelden</h2>

            {error && (
                <div className="alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label
                        htmlFor="email"
                        className="form-label"
                    >
                        E-Mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label
                        htmlFor="password"
                        className="form-label"
                    >
                        Passwort
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                    <div className="form-forgot-password">
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                            Passwort vergessen?
                        </a>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                >
                    {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Noch kein Konto? {' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800">
                        Registrieren
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
