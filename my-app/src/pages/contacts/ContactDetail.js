// src/pages/contacts/ContactDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CalendarIcon,
    DocumentTextIcon,
    ChartBarIcon,
    LightningBoltIcon
} from '@heroicons/react/outline';
import ContactModal from './ContactModal';
import NewTaskModal from '../tasks/NewTaskModal';
import NewPolicyModal from './NewPolicyModal';

const ContactDetail = () => {
    const { contactId } = useParams();
    const navigate = useNavigate();
    const { isPremium } = useAuth();

    const [contact, setContact] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [leadScore, setLeadScore] = useState(null);
    const [followUpSuggestions, setFollowUpSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isLeadScoreLoading, setIsLeadScoreLoading] = useState(false);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

    // Kontaktdaten laden
    useEffect(() => {
        const fetchContactData = async () => {
            try {
                // Kontakt abrufen
                const contactResponse = await api.contacts.getById(contactId);
                setContact(contactResponse.data);

                // Policen abrufen
                const policiesResponse = await api.contacts.getPolicies(contactId);
                setPolicies(policiesResponse.data);

                // Aufgaben abrufen
                const tasksResponse = await api.contacts.getTasks(contactId);
                setTasks(tasksResponse.data);

                // Lead-Score und Vorschläge nur für Premium-Nutzer laden
                if (isPremium()) {
                    // Lead-Score abrufen (wenn verfügbar und > 0)
                    if (contactResponse.data.lead_score > 0) {
                        setLeadScore(contactResponse.data.lead_score);
                    }

                    // Bei Bedarf manuell nachladen
                    if (contactResponse.data.lead_score === 0) {
                        calculateLeadScore();
                    }

                    // Follow-Up-Vorschläge abrufen
                    loadFollowUpSuggestions();
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching contact data:', error);
                setLoading(false);
            }
        };

        fetchContactData();
    }, [contactId, isPremium]);

    // Lead-Score berechnen
    const calculateLeadScore = async () => {
        if (!isPremium()) return;

        setIsLeadScoreLoading(true);
        try {
            const response = await api.contacts.getLeadScore(contactId);
            setLeadScore(response.data.lead_score);

            // Kontakt mit neuem Lead-Score aktualisieren
            setContact(prev => ({
                ...prev,
                lead_score: response.data.lead_score
            }));
        } catch (error) {
            console.error('Error calculating lead score:', error);
        } finally {
            setIsLeadScoreLoading(false);
        }
    };

    // Follow-Up-Vorschläge laden
    const loadFollowUpSuggestions = async () => {
        if (!isPremium()) return;

        setIsSuggestionsLoading(true);
        try {
            const response = await api.contacts.getFollowUpSuggestions(contactId);
            setFollowUpSuggestions(response.data.suggestions);
        } catch (error) {
            console.error('Error loading follow-up suggestions:', error);
        } finally {
            setIsSuggestionsLoading(false);
        }
    };

    // Kontakt aktualisieren
    const handleUpdateContact = async (updatedContactData) => {
        try {
            const response = await api.contacts.update(contactId, updatedContactData);
            setContact(response.data);
            setIsContactModalOpen(false);
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    // Kontakt löschen
    const handleDeleteContact = async () => {
        if (window.confirm('Sind Sie sicher, dass Sie diesen Kontakt löschen möchten?')) {
            try {
                await api.contacts.delete(contactId);
                navigate('/contacts');
            } catch (error) {
                console.error('Error deleting contact:', error);
            }
        }
    };

    // Neue Aufgabe erstellen
    const handleCreateTask = async (taskData) => {
        try {
            const enhancedData = {
                ...taskData,
                contact: contactId
            };

            const response = await api.tasks.create(enhancedData);
            setTasks([...tasks, response.data]);
            setIsTaskModalOpen(false);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    // Neue Police erstellen
    const handleCreatePolicy = async (policyData) => {
        try {
            const enhancedData = {
                ...policyData,
                contact: contactId
            };

            // API-Aufruf zum Erstellen einer Police
            // Annahme: Es gibt eine entsprechende API-Route
            const response = await api.post(`/api/contacts/${contactId}/policies/`, enhancedData);
            setPolicies([...policies, response.data]);
            setIsPolicyModalOpen(false);
        } catch (error) {
            console.error('Error creating policy:', error);
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

    // Hilfs-Funktionen für die Anzeige
    const getContactTypeLabel = () => {
        if (!contact) return '';

        switch (contact.contact_type) {
            case 'CUSTOMER': return 'Kunde';
            case 'POTENTIAL_CUSTOMER': return 'Potenzieller Kunde';
            case 'PARTNER': return 'Partner';
            case 'POTENTIAL_PARTNER': return 'Potenzieller Partner';
            default: return contact.contact_type;
        }
    };

    const getContactTypeBadgeColor = () => {
        if (!contact) return 'bg-gray-100 text-gray-800';

        switch (contact.contact_type) {
            case 'CUSTOMER': return 'bg-green-100 text-green-800';
            case 'POTENTIAL_CUSTOMER': return 'bg-blue-100 text-blue-800';
            case 'PARTNER': return 'bg-purple-100 text-purple-800';
            case 'POTENTIAL_PARTNER': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';

        const date = new Date(dateString);
        return new Intl.DateTimeFormat('de-DE').format(date);
    };

    if (loading) {
        return <div className="p-4 text-center">Lade Kontaktdaten...</div>;
    }

    if (!contact) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-500 mb-4">Kontakt nicht gefunden</p>
                <Link
                    to="/contacts"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Zurück zur Kontaktliste
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header mit Aktionen */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center">
                    <Link
                        to="/contacts"
                        className="mr-4 text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {contact.first_name} {contact.last_name}
                        </h1>
                        <div className="flex items-center mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContactTypeBadgeColor()}`}>
                {getContactTypeLabel()}
              </span>
                            {isPremium() && leadScore !== null && (
                                <div className="ml-3 flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${
                                                leadScore >= 70 ? 'bg-green-600' :
                                                    leadScore >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}
                                            style={{ width: `${leadScore}%` }}
                                        ></div>
                                    </div>
                                    <span className="ml-2 text-xs text-gray-500">Lead-Score: {leadScore}%</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Aufgabe
                    </button>
                    <button
                        onClick={() => setIsPolicyModalOpen(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Police
                    </button>
                    <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Bearbeiten
                    </button>
                    <button
                        onClick={handleDeleteContact}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50"
                    >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Löschen
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kontaktdetails */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Kontaktinformationen</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                <dd className="mt-1 text-sm text-gray-900">{contact.first_name} {contact.last_name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">E-Mail</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {contact.email ? (
                                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                                            {contact.email}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {contact.phone ? (
                                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                                            {contact.phone}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Notizen</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {contact.notes ? (
                                        <p className="whitespace-pre-line">{contact.notes}</p>
                                    ) : (
                                        <span className="text-gray-400">Keine Notizen vorhanden</span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Policen */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Policen</h3>
                        <button
                            onClick={() => setIsPolicyModalOpen(true)}
                            className="inline-flex items-center p-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {policies.length === 0 ? (
                            <div className="px-4 py-5 text-center text-sm text-gray-500">
                                Keine Policen vorhanden
                            </div>
                        ) : (
                            policies.map(policy => (
                                <div key={policy.id} className="px-4 py-3 sm:px-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{policy.name}</h4>
                                            <p className="text-xs text-gray-500">{policy.policy_type}</p>
                                        </div>
                                        <div className="text-right text-xs text-gray-500">
                                            <p>Gültig bis: {formatDate(policy.end_date)}</p>
                                        </div>
                                    </div>
                                    {policy.notes && (
                                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{policy.notes}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Aufgaben */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Aufgaben</h3>
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="inline-flex items-center p-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {tasks.length === 0 ? (
                            <div className="px-4 py-5 text-center text-sm text-gray-500">
                                Keine Aufgaben vorhanden
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className="px-4 py-3 sm:px-6">
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleCompleteTask(task.id)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1"
                                        />
                                        <div className="ml-3 flex-1">
                                            <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                {task.title}
                                            </p>
                                            <div className="flex justify-between mt-1">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                                    {formatDate(task.due_date)}
                                                </div>
                                                <span className="text-xs text-gray-500">
                          {task.task_type === 'CALL' && 'Anruf'}
                                                    {task.task_type === 'EMAIL' && 'E-Mail'}
                                                    {task.task_type === 'MEETING' && 'Treffen'}
                                                    {task.task_type === 'OTHER' && 'Sonstiges'}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Premium-Features: KI-Assistenz */}
            {isPremium() && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">KI-Assistenz</h3>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-medium text-gray-900">
                  <span className="inline-flex items-center">
                    <LightningBoltIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    Intelligente Follow-Up-Vorschläge
                  </span>
                                </h3>

                                <button
                                    onClick={loadFollowUpSuggestions}
                                    disabled={isSuggestionsLoading}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    {isSuggestionsLoading ? 'Wird geladen...' : 'Aktualisieren'}
                                </button>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {followUpSuggestions.length === 0 ? (
                                <div className="px-4 py-5 text-center text-sm text-gray-500">
                                    {isSuggestionsLoading
                                        ? 'Vorschläge werden geladen...'
                                        : 'Keine intelligenten Vorschläge verfügbar'}
                                </div>
                            ) : (
                                followUpSuggestions.map((suggestion, index) => (
                                    <div key={index} className="px-4 py-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <div className={`rounded-full p-1 ${
                                                    suggestion.priority === 'HIGH'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                    <LightningBoltIcon className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                                                <p className="mt-1 text-sm text-gray-500">{suggestion.description}</p>

                                                <div className="mt-3">
                                                    <button
                                                        onClick={() => {
                                                            // Aufgabe aus Vorschlag erstellen
                                                            setIsTaskModalOpen(true);
                                                            // Idealerweise würden wir hier den Task-Modal mit Vorschlagdaten vorausfüllen
                                                        }}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                                    >
                                                        <PlusIcon className="h-4 w-4 mr-1" />
                                                        Als Aufgabe hinzufügen
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {isContactModalOpen && (
                <ContactModal
                    isOpen={isContactModalOpen}
                    onClose={() => setIsContactModalOpen(false)}
                    onSave={handleUpdateContact}
                    contact={contact}
                />
            )}

            {isTaskModalOpen && (
                <NewTaskModal
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSave={handleCreateTask}
                    contactId={contactId}
                />
            )}

            {isPolicyModalOpen && (
                <NewPolicyModal
                    isOpen={isPolicyModalOpen}
                    onClose={() => setIsPolicyModalOpen(false)}
                    onSave={handleCreatePolicy}
                    contactId={contactId}
                />
            )}
        </div>
    );
};

export default ContactDetail;