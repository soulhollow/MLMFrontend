// src/pages/contacts/NewPolicyModal.js
import React, { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';

const NewPolicyModal = ({ isOpen, onClose, onSave, contactId }) => {
    const [formData, setFormData] = useState({
        name: '',
        policy_type: '',
        start_date: '',
        end_date: '',
        notes: ''
    });

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

    // Eine Liste von typischen Versicherungsarten
    const policyTypes = [
        'Lebensversicherung',
        'Krankenversicherung',
        'Hausratversicherung',
        'Haftpflichtversicherung',
        'KFZ-Versicherung',
        'Unfallversicherung',
        'Berufsunfähigkeitsversicherung',
        'Rentenversicherung',
        'Rechtsschutzversicherung',
        'Andere'
    ];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl mx-auto max-w-lg w-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Neue Police hinzufügen
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
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Bezeichnung *
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="z.B. Lebensversicherung Familie Müller"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="policy_type"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Versicherungsart *
                        </label>
                        <select
                            id="policy_type"
                            name="policy_type"
                            value={formData.policy_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Bitte wählen...</option>
                            {policyTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                        <div>
                            <label
                                htmlFor="start_date"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Startdatum *
                            </label>
                            <input
                                id="start_date"
                                name="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="end_date"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Enddatum *
                            </label>
                            <input
                                id="end_date"
                                name="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
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
                            placeholder="Weitere Details zur Police"
                        ></textarea>
                    </div>

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
                            Police speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPolicyModal;