// src/pages/tasks/TasksPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    PlusIcon,
    FilterIcon,
    SearchIcon,
    XIcon,
    CheckCircleIcon,
    CalendarIcon,
    ClockIcon
} from '@heroicons/react/outline';
import NewTaskModal from './NewTaskModal';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('PENDING');
    const [filterType, setFilterType] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Überprüfen, ob eine neue Aufgabe erstellt werden soll (aus URL-Parameter)
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('new') === 'true') {
            setIsModalOpen(true);
            // URL-Parameter entfernen
            navigate('/tasks', { replace: true });
        }
    }, [location, navigate]);

    // Aufgaben laden
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.tasks.getAll();
                setTasks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Aufgaben filtern
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Nach Status filtern
            if (filterStatus === 'PENDING' && task.completed) {
                return false;
            }
            if (filterStatus === 'COMPLETED' && !task.completed) {
                return false;
            }

            // Nach Typ filtern
            if (filterType !== 'ALL' && task.task_type !== filterType) {
                return false;
            }

            // Nach Suchbegriff filtern
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    task.title.toLowerCase().includes(query) ||
                    (task.description && task.description.toLowerCase().includes(query))
                );
            }

            return true;
        });
    }, [tasks, filterStatus, filterType, searchQuery]);

    // Neue Aufgabe erstellen
    const handleCreateTask = async (taskData) => {
        try {
            const response = await api.tasks.create(taskData);
            setTasks([...tasks, response.data]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    // Aufgabe als erledigt markieren
    const handleCompleteTask = async (taskId) => {
        try {
            const response = await api.tasks.markComplete(taskId);

            // Aufgabenliste aktualisieren
            setTasks(tasks.map(task =>
                task.id === taskId ? response.data : task
            ));
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    // Aufgabe löschen
    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?')) {
            try {
                await api.tasks.delete(taskId);
                setTasks(tasks.filter(task => task.id !== taskId));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    // Hilfsfunktionen
    const getTaskTypeLabel = (type) => {
        switch (type) {
            case 'CALL': return 'Anruf';
            case 'EMAIL': return 'E-Mail';
            case 'MEETING': return 'Treffen';
            case 'OTHER': return 'Sonstiges';
            default: return type;
        }
    };

    const getTaskTypeColor = (type) => {
        switch (type) {
            case 'CALL': return 'text-blue-500';
            case 'EMAIL': return 'text-green-500';
            case 'MEETING': return 'text-purple-500';
            default: return 'text-gray-500';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';

        const date = new Date(dateString);
        return new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    if (loading) {
        return <div className="p-4 text-center">Aufgaben werden geladen...</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Aufgaben</h1>
                    <p className="text-gray-600 mt-1">
                        Verwalten Sie Ihre anstehenden und erledigten Aufgaben
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Neue Aufgabe
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Suchleiste und Filter */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Aufgabe suchen..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FilterIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ALL">Alle Status</option>
                                <option value="PENDING">Ausstehend</option>
                                <option value="COMPLETED">Erledigt</option>
                            </select>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FilterIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ALL">Alle Typen</option>
                                <option value="CALL">Anrufe</option>
                                <option value="EMAIL">E-Mails</option>
                                <option value="MEETING">Treffen</option>
                                <option value="OTHER">Sonstiges</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Aufgabenliste */}
                {filteredTasks.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchQuery || filterStatus !== 'PENDING' || filterType !== 'ALL' ? (
                            <p>Keine Aufgaben gefunden, die den Filterkriterien entsprechen.</p>
                        ) : (
                            <div>
                                <p className="mb-4">Sie haben noch keine Aufgaben erstellt.</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Erste Aufgabe erstellen
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aufgabe
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kontakt
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fälligkeit
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aktionen
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTasks.map(task => (
                                <tr key={task.id} className={`${task.completed ? 'bg-gray-50' : ''} hover:bg-gray-50`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleCompleteTask(task.id)}
                                            className={`${
                                                task.completed
                                                    ? 'text-green-500'
                                                    : 'text-gray-300 hover:text-green-500'
                                            }`}
                                        >
                                            <CheckCircleIcon className="h-6 w-6" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                        <span className={`flex-shrink-0 h-5 w-5 ${getTaskTypeColor(task.task_type)}`}>
                          <CalendarIcon className="h-5 w-5" />
                        </span>
                                            <div className="ml-3">
                                                <div className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                    {task.title}
                                                </div>
                                                {task.description && (
                                                    <div className="text-sm text-gray-500 line-clamp-1">
                                                        {task.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            to={`/contacts/${task.contact.id}`}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            {task.contact.first_name} {task.contact.last_name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${
                                            task.completed
                                                ? 'text-gray-500'
                                                : isOverdue(task.due_date)
                                                    ? 'text-red-600 font-medium'
                                                    : 'text-gray-900'
                                        }`}>
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                {formatDate(task.due_date)}
                                            </div>
                                            {!task.completed && isOverdue(task.due_date) && (
                                                <span className="mt-1 text-xs text-red-600">Überfällig</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Löschen
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Neue Aufgabe Modal */}
            {isModalOpen && (
                <NewTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleCreateTask}
                />
            )}
        </div>
    );
};

export default TasksPage;