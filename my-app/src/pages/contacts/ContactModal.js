// src/pages/contacts/ContactModal.js
import React, { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/outline';

const ContactModal = ({ isOpen, onClose, onSave, contact = null }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        contact_type: 'POTENTIAL_CUSTOMER',
        notes: ''
    });

    // Formular mit Kontaktdaten füllen, wenn ein Kontakt bearbeitet wird
    useEffect(() => {
        if (contact) {
            setFormData({
                first_name: contact.first_name || '',
                last_name: contact.last_name || '',
                email: contact.email || '',
                phone: contact.phone || '',
                contact_type: contact.contact_type || 'POTENTIAL_CUSTOMER',
                notes: contact.notes || ''
            });
        }
    }, [contact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    const contactTypeOptions = [
        { value: 'CUSTOMER', label: 'Kunde' },
        { value: 'POTENTIAL_CUSTOMER', label: 'Potenzieller Kunde' },
        { value: 'PARTNER', label: 'Partner' },
        { value: 'POTENTIAL_PARTNER', label: 'Potenzieller Partner' }
    ];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl mx-auto max-w-lg w-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {contact ? 'Kontakt bearbeiten' : 'Neuen Kontakt erstellen'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="first_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Vorname *
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="last_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nachname *
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            E-Mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Telefon
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="contact_type"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Kontakttyp *
                        </label>
                        <select
                            id="contact_type"
                            name="contact_type"
                            value={formData.contact_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            {contactTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="notes"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Notizen
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
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
                            {contact ? 'Aktualisieren' : 'Erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;