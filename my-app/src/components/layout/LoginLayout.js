// src/components/layout/LoginLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';

// CSS-Imports werden bereits zentral geladen

const LoginLayout = () => {
    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-logo">
                    <h1>MLM CRM</h1>
                    <p>
                        Das intelligente CRM für MLM-Versicherungsvertreter
                    </p>
                </div>

                <div className="auth-card">
                    <Outlet />
                </div>

                <p className="auth-footer">
                    © {new Date().getFullYear()} MLM CRM. Alle Rechte vorbehalten.
                </p>
            </div>
        </div>
    );
};

export default LoginLayout;
