// src/pages/contacts/ContactsPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
    SearchIcon,
    PlusIcon,
    FilterIcon,
    DotsVerticalIcon,
    XIcon
} from '@heroicons/react/outline';
import ContactModal from './ContactModal';

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const { isPremium } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Überprüfen, ob ein neuer Kontakt erstellt werden soll (aus URL-Parameter)
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('new') === 'true') {
            setIsModalOpen(true);
            // URL-Parameter entfernen
            navigate('/contacts', { replace: true });
        }
    }, [location, navigate]);

    // Kontakte laden
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await api.contacts.getAll();
                setContacts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contacts:', error);
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    // Kontakttyp-Optionen
    const contactTypeOptions = [
        { value: 'ALL', label: 'Alle Kontakte' },
        { value: 'CUSTOMER', label: 'Kunden' },
        { value: 'POTENTIAL_CUSTOMER', label: 'Potenzielle Kunden' },
        { value: 'PARTNER', label: 'Partner' },
        { value: 'POTENTIAL_PARTNER', label: 'Potenzielle Partner' }
    ];

    // Kontakte filtern
    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            // Nach Typ filtern
            if (selectedType !== 'ALL' && contact.contact_type !== selectedType) {
                return false;
            }

            // Nach Suchbegriff filtern
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    contact.first_name.toLowerCase().includes(query) ||
                    contact.last_name.toLowerCase().includes(query) ||
                    (contact.email && contact.email.toLowerCase().includes(query)) ||
                    (contact.phone && contact.phone.toLowerCase().includes(query))
                );
            }

            return true;
        });
    }, [contacts, selectedType, searchQuery]);

    // Kontakt hinzufügen/bearbeiten
    const handleSaveContact = async (contactData) => {
        try {
            let updatedContact;

            if (editingContact) {
                // Kontakt bearbeiten
                const response = await api.contacts.update(editingContact.id, contactData);
                updatedContact = response.data;

                // Kontaktliste aktualisieren
                setContacts(contacts.map(contact =>
                    contact.id === updatedContact.id ? updatedContact : contact
                ));
            } else {
                // Neuen Kontakt erstellen
                const response = await api.contacts.create(contactData);
                updatedContact = response.data;

                // Zur Kontaktliste hinzufügen
                setContacts([...contacts, updatedContact]);
            }

            setIsModalOpen(false);
            setEditingContact(null);
        } catch (error) {
            console.error('Error saving contact:', error);
            // Hier könnten Fehlermeldungen angezeigt werden
        }
    };

    // Kontakt zum Bearbeiten öffnen
    const handleEditContact = (contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    // Kontakt löschen
    const handleDeleteContact = async (contactId) => {
        if (window.confirm('Sind Sie sicher, dass Sie diesen Kontakt löschen möchten?')) {
            try {
                await api.contacts.delete(contactId);
                setContacts(contacts.filter(contact => contact.id !== contactId));
            } catch (error) {
                console.error('Error deleting contact:', error);
            }
        }
    };

    // Modal schließen
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingContact(null);
    };

    // Kontakttype-Label
    const getContactTypeLabel = (type) => {
        const option = contactTypeOptions.find(opt => opt.value === type);
        return option ? option.label : type;
    };

    // Kontakttype-Badge-Farbe
    const getContactTypeBadgeColor = (type) => {
        switch (type) {
            case 'CUSTOMER':
                return 'bg-green-100 text-green-800';
            case 'POTENTIAL_CUSTOMER':
                return 'bg-blue-100 text-blue-800';
            case 'PARTNER':
                return 'bg-purple-100 text-purple-800';
            case 'POTENTIAL_PARTNER':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Kontakte werden geladen...</div>;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kontakte</h1>
                    <p className="text-gray-600 mt-1">
                        Verwalten Sie Ihre Kunden- und Partnerkontakte
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingContact(null);
                        setIsModalOpen(true);
                    }}
                    className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Kontakt hinzufügen
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
                                placeholder="Kontakt suchen..."
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
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {contactTypeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Kontaktliste */}
                {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchQuery || selectedType !== 'ALL' ? (
                            <p>Keine Kontakte gefunden, die den Filterkriterien entsprechen.</p>
                        ) : (
                            <div>
                                <p className="mb-4">Sie haben noch keine Kontakte hinzugefügt.</p>
                                <button
                                    onClick={() => {
                                        setEditingContact(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Ersten Kontakt hinzufügen
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
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kontaktdaten
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Typ
                                </th>
                                {isPremium() && (
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lead-Score
                                    </th>
                                )}
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aktionen
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredContacts.map(contact => (
                                <tr key={contact.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/contacts/${contact.id}`} className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                          </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-blue-600 hover:underline">
                                                    {contact.first_name} {contact.last_name}
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{contact.email || '-'}</div>
                                        <div className="text-sm text-gray-500">{contact.phone || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getContactTypeBadgeColor(contact.contact_type)}`}>
                        {getContactTypeLabel(contact.contact_type)}
                      </span>
                                    </td>
                                    {isPremium() && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${
                                                        contact.lead_score >= 70 ? 'bg-green-600' :
                                                            contact.lead_score >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                                                    }`}
                                                    style={{ width: `${contact.lead_score}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{contact.lead_score}%</div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                to={`/contacts/${contact.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Details
                                            </Link>
                                            <button
                                                onClick={() => handleEditContact(contact)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Bearbeiten
                                            </button>
                                            <button
                                                onClick={() => handleDeleteContact(contact.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Löschen
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Kontakt hinzufügen/bearbeiten Modal */}
            {isModalOpen && (
                <ContactModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveContact}
                    contact={editingContact}
                />
            )}
        </div>
    );
};

export default ContactsPage;