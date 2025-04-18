// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
    UserIcon,
    CalendarIcon,
    ChartBarIcon,
    LightningBoltIcon,
    ExclamationIcon,
    PlusCircleIcon
} from '@heroicons/react/outline';

// Dashboard-Karten-Komponente
const StatCard = ({ title, value, icon: Icon, color, linkTo }) => {
    return (
        <Link
            to={linkTo}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`rounded-full p-3 ${color}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <h3 className="text-2xl font-bold text-gray-700">{value}</h3>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// Aufgabenliste-Komponente
const TaskList = ({ tasks }) => {
    const getTaskTypeIcon = (type) => {
        switch (type) {
            case 'CALL':
                return <CalendarIcon className="h-5 w-5 text-blue-500" />;
            case 'EMAIL':
                return <CalendarIcon className="h-5 w-5 text-green-500" />;
            case 'MEETING':
                return <CalendarIcon className="h-5 w-5 text-purple-500" />;
            default:
                return <CalendarIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Anstehende Aufgaben</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        Keine anstehenden Aufgaben
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    {getTaskTypeIcon(task.task_type)}
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                                    <div className="flex items-center mt-1">
                                        <p className="text-xs text-gray-500">
                                            {new Date(task.due_date).toLocaleDateString('de-DE')}
                                        </p>
                                        <p className="text-xs text-gray-500 ml-2">
                                            {task.contact.first_name} {task.contact.last_name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 border-t border-gray-200">
                <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Alle Aufgaben anzeigen
                </Link>
            </div>
        </div>
    );
};

// Follow-Up-Vorschläge-Komponente
const FollowUpSuggestions = ({ suggestions }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">KI-Empfehlungen</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {suggestions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        Keine Empfehlungen verfügbar
                    </div>
                ) : (
                    suggestions.map((suggestion, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <LightningBoltIcon className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-800">{suggestion.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{suggestion.description}</p>
                                    <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        suggestion.priority === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {suggestion.priority === 'HIGH' ? 'Hohe Priorität' : 'Mittlere Priorität'}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Hauptkomponente
const Dashboard = () => {
    const { isPremium } = useAuth();
    const [stats, setStats] = useState({
        totalContacts: 0,
        potentialCustomers: 0,
        potentialPartners: 0,
        upcomingTasks: 0
    });
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Kontaktstatistiken abrufen
                const contactsResponse = await api.contacts.getAll();
                const contacts = contactsResponse.data;

                // Aufgaben abrufen
                const tasksResponse = await api.tasks.getUpcoming();
                const tasks = tasksResponse.data;

                // Statistiken berechnen
                const potentialCustomers = contacts.filter(c => c.contact_type === 'POTENTIAL_CUSTOMER').length;
                const potentialPartners = contacts.filter(c => c.contact_type === 'POTENTIAL_PARTNER').length;

                setStats({
                    totalContacts: contacts.length,
                    potentialCustomers,
                    potentialPartners,
                    upcomingTasks: tasks.length
                });

                setUpcomingTasks(tasks);

                // Wenn Premium-Nutzer, KI-Empfehlungen abrufen
                if (isPremium()) {
                    // Hier würden wir normalerweise einen API-Aufruf machen, um KI-Empfehlungen zu erhalten
                    // Für Demo-Zwecke werden Beispieldaten verwendet
                    setSuggestions([
                        {
                            title: 'Policenerneuerung für Max Mustermann',
                            description: 'Lebensversicherung läuft in 30 Tagen ab',
                            priority: 'HIGH',
                            type: 'POLICY_RENEWAL'
                        },
                        {
                            title: 'Kontaktaufnahme mit Erika Musterfrau',
                            description: 'Kein Kontakt seit 95 Tagen',
                            priority: 'MEDIUM',
                            type: 'REACTIVATION'
                        }
                    ]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isPremium]);

    if (loading) {
        return <div className="p-4">Lade Dashboard-Daten...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">Willkommen zurück! Hier ist ein Überblick über Ihr CRM.</p>
            </div>

            {/* Premium-Badge für Basis-Nutzer */}
            {!isPremium() && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <span className="font-medium">Auf Premium upgraden!</span> Erhalten Sie Zugang zu Premium-Funktionen wie KI-Lead-Scoring, Team-Übersicht und mehr.
                            </p>
                            <div className="mt-2">
                                <Link
                                    to="/profile"
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Zu Premium wechseln
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistik-Karten */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Kontakte gesamt"
                    value={stats.totalContacts}
                    icon={UserIcon}
                    color="bg-blue-500"
                    linkTo="/contacts"
                />
                <StatCard
                    title="Potenzielle Kunden"
                    value={stats.potentialCustomers}
                    icon={UserIcon}
                    color="bg-green-500"
                    linkTo="/contacts"
                />
                <StatCard
                    title="Potenzielle Partner"
                    value={stats.potentialPartners}
                    icon={UserIcon}
                    color="bg-purple-500"
                    linkTo="/contacts"
                />
                <StatCard
                    title="Anstehende Aufgaben"
                    value={stats.upcomingTasks}
                    icon={CalendarIcon}
                    color="bg-orange-500"
                    linkTo="/tasks"
                />
            </div>

            {/* Schnellzugriff-Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                    to="/contacts?new=true"
                    className="flex items-center justify-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                >
                    <PlusCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-gray-700 font-medium">Neuer Kontakt</span>
                </Link>
                <Link
                    to="/tasks?new=true"
                    className="flex items-center justify-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                >
                    <PlusCircleIcon className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-gray-700 font-medium">Neue Aufgabe</span>
                </Link>
                <Link
                    to="/pipelines"
                    className="flex items-center justify-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                >
                    <ChartBarIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700 font-medium">Pipeline ansehen</span>
                </Link>
                {isPremium() && (
                    <Link
                        to="/team"
                        className="flex items-center justify-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                    >
                        <UserIcon className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="text-gray-700 font-medium">Team anzeigen</span>
                    </Link>
                )}
            </div>

            {/* Aufgaben und KI-Empfehlungen */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <TaskList tasks={upcomingTasks} />
                {isPremium() && <FollowUpSuggestions suggestions={suggestions} />}
            </div>
        </div>
    );
};

export default Dashboard;