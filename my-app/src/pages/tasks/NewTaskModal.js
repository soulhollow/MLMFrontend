// src/pages/tasks/NewTaskModal.js
import React, { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/outline';
import api from '../../services/api';

const NewTaskModal = ({ isOpen, onClose, onSave, contactId = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        task_type: 'CALL',
        due_date: '',
        due_time: '09:00',
        contact: ''
    });
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Kontakte laden, wenn kein konkreter Kontakt übergeben wurde
    useEffect(() => {
        const fetchContacts = async () => {
            if (contactId) {
                setFormData(prev => ({ ...prev, contact: contactId }));
                return;
            }

            setLoading(true);
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
    }, [contactId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ISO 8601 Datum und Uhrzeit für due_date erstellen
        const dateTime = new Date(`${formData.due_date}T${formData.due_time}`);

        // Aufgabendaten erstellen
        const taskData = {
            title: formData.title,
            description: formData.description,
            task_type: formData.task_type,
            due_date: dateTime.toISOString(),
            contact: formData.contact || contactId
        };

        onSave(taskData);
    };

    if (!isOpen) return null;

    // Task-Typen
    const taskTypes = [
        { value: 'CALL', label: 'Anruf' },
        { value: 'EMAIL', label: 'E-Mail' },
        { value: 'MEETING', label: 'Treffen' },
        { value: 'OTHER', label: 'Sonstiges' }
    ];

    // Aktuelles Datum für Datums-Input
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl mx-auto max-w-lg w-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Neue Aufgabe erstellen
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Titel *
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="z.B. Policendetails besprechen"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Beschreibung
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Details zur Aufgabe"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="task_type"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Aufgabentyp *
                        </label>
                        <select
                            id="task_type"
                            name="task_type"
                            value={formData.task_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            {taskTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                        <div>
                            <label
                                htmlFor="due_date"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Fälligkeitsdatum *
                            </label>
                            <input
                                id="due_date"
                                name="due_date"
                                type="date"
                                value={formData.due_date}
                                onChange={handleChange}
                                min={today}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="due_time"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Uhrzeit *
                            </label>
                            <input
                                id="due_time"
                                name="due_time"
                                type="time"
                                value={formData.due_time}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {!contactId && (
                        <div className="mb-6">
                            <label
                                htmlFor="contact"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Kontakt *
                            </label>
                            <select
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={loading}
                            >
                                <option value="">Bitte wählen...</option>
                                {contacts.map(contact => (
                                    <option key={contact.id} value={contact.id}>
                                        {contact.first_name} {contact.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Aufgabe speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTaskModal;