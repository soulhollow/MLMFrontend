// src/components/layout/Layout.js
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    HomeIcon,
    UserIcon,
    UsersIcon,
    InboxIcon,
    CalendarIcon,
    ViewBoardsIcon,
    CogIcon,
    LogoutIcon,
    MenuIcon,
    XIcon,
    BellIcon
} from '@heroicons/react/outline';

const Layout = () => {
    const { currentUser, logout, isPremium } = useAuth();
    const [isSide// src/components/layout/Layout.js
        import React, { useState } from 'react';
        import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
        import { useAuth } from '../../contexts/AuthContext';
        import {
            HomeIcon,
            UserIcon,
            UsersIcon,
            InboxIcon,
            CalendarIcon,
            ViewBoardsIcon,
            CogIcon,
            LogoutIcon,
            MenuIcon,
            XIcon,
            BellIcon
        } from '@heroicons/react/outline';

// CSS-Imports wurden in App.css bereits zentral geladen

        const Layout = () => {
            const { currentUser, logout, isPremium } = useAuth();
            const [isSidebarOpen, setIsSidebarOpen] = useState(true);
            const location = useLocation();
            const navigate = useNavigate();

            const handleLogout = () => {
                logout();
                navigate('/login');
            };

            const navigationItems = [
                { name: 'Dashboard', icon: HomeIcon, path: '/' },
                { name: 'Kontakte', icon: UserIcon, path: '/contacts' },
                { name: 'Aufgaben', icon: CalendarIcon, path: '/tasks' },
                { name: 'Pipelines', icon: ViewBoardsIcon, path: '/pipelines' },
                { name: 'Team', icon: UsersIcon, path: '/team', premium: true },
            ];

            const toggleSidebar = () => {
                setIsSidebarOpen(!isSidebarOpen);
            };

            return (
                <div className="flex h-screen bg-gray-100">
                    {/* Sidebar für Desktop */}
                    <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-xl font-bold text-primary">MLM CRM</h1>
                                <button
                                    onClick={toggleSidebar}
                                    className="sidebar-toggle"
                                >
                                    {isSidebarOpen ? (
                                        <XIcon className="h-6 w-6" />
                                    ) : (
                                        <MenuIcon className="h-6 w-6" />
                                    )}
                                </button>
                            </div>

                            <nav className="space-y-1">
                                {navigationItems.map((item) => {
                                    // Premium-Elemente ausblenden, wenn Benutzer kein Premium hat
                                    if (item.premium && !isPremium()) return null;

                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`nav-link ${isActive ? 'active' : ''}`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {isSidebarOpen && <span>{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="mt-auto p-4">
                            <Link to="/profile" className="nav-link">
                                <CogIcon className="h-5 w-5" />
                                {isSidebarOpen && <span>Einstellungen</span>}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="nav-link text-red-500 hover:text-red-700"
                            >
                                <LogoutIcon className="h-5 w-5" />
                                {isSidebarOpen && <span>Abmelden</span>}
                            </button>
                        </div>
                    </div>

                    {/* Hauptinhalt */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Obere Leiste */}
                        <header className="top-header">
                            <div className="header-content">
                                <div className="flex justify-between h-16">
                                    <div className="flex">
                                        <button
                                            onClick={toggleSidebar}
                                            className="mobile-menu-button"
                                        >
                                            <MenuIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="user-profile-area">
                                        <button className="notification-button">
                                            <BellIcon className="h-6 w-6" />
                                        </button>
                                        <div className="ml-3 relative">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-700">
                                                        {currentUser?.first_name} {currentUser?.last_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {isPremium() ? 'Premium-Nutzer' : 'Basis-Nutzer'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Inhalt */}
                        <main className="main-content">
                            <Outlet />
                        </main>
                    </div>
                </div>
            );
        };

        export default Layout;barOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigationItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/' },
        { name: 'Kontakte', icon: UserIcon, path: '/contacts' },
        { name: 'Aufgaben', icon: CalendarIcon, path: '/tasks' },
        { name: 'Pipelines', icon: ViewBoardsIcon, path: '/pipelines' },
        { name: 'Team', icon: UsersIcon, path: '/team', premium: true },
    ];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar für Desktop */}
            <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-bold text-primary">MLM CRM</h1>
                        <button
                            onClick={toggleSidebar}
                            className="sidebar-toggle"
                        >
                            {isSidebarOpen ? (
                                <XIcon className="h-6 w-6" />
                            ) : (
                                <MenuIcon className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    <nav className="space-y-1">
                        {navigationItems.map((item) => {
                            // Premium-Elemente ausblenden, wenn Benutzer kein Premium hat
                            if (item.premium && !isPremium()) return null;

                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4">
                    <Link to="/profile" className="nav-link">
                        <CogIcon className="h-5 w-5" />
                        {isSidebarOpen && <span>Einstellungen</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="nav-link text-red-500 hover:text-red-700"
                    >
                        <LogoutIcon className="h-5 w-5" />
                        {isSidebarOpen && <span>Abmelden</span>}
                    </button>
                </div>
            </div>

            {/* Hauptinhalt */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Obere Leiste */}
                <header className="bg-white shadow-sm z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <button
                                    onClick={toggleSidebar}
                                    className="md:hidden px-4 inline-flex items-center"
                                >
                                    <MenuIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="flex items-center">
                                <button className="p-2 rounded-full hover:bg-gray-100">
                                    <BellIcon className="h-6 w-6" />
                                </button>
                                <div className="ml-3 relative">
                                    <div className="flex items-center">
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-700">
                                                {currentUser?.first_name} {currentUser?.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {isPremium() ? 'Premium-Nutzer' : 'Basis-Nutzer'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Inhalt */}
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;