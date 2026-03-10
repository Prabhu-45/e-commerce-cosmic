import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { X, Save } from 'lucide-react';

export default function AddressForm({ onSave, onCancel, initialData = null }) {
    const [formData, setFormData] = useState(initialData || {
        lane1: '',
        lane2: '',
        country: '',
        countryCode: '',
        state: '',
        stateCode: '',
        district: '',
        pincode: '',
        isDefault: false
    });
    const [error, setError] = useState('');

    const [countries] = useState(Country.getAllCountries());
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (formData.countryCode) {
            setStates(State.getStatesOfCountry(formData.countryCode));
        } else {
            setStates([]);
        }
    }, [formData.countryCode]);

    useEffect(() => {
        if (formData.countryCode && formData.stateCode) {
            setCities(City.getCitiesOfState(formData.countryCode, formData.stateCode));
        } else {
            setCities([]);
        }
    }, [formData.countryCode, formData.stateCode]);

    const handleCountryChange = (e) => {
        const country = countries.find(c => c.isoCode === e.target.value);
        setFormData({
            ...formData,
            country: country ? country.name : '',
            countryCode: e.target.value,
            state: '',
            stateCode: '',
            district: ''
        });
    };

    const handleStateChange = (e) => {
        const state = states.find(s => s.isoCode === e.target.value);
        setFormData({
            ...formData,
            state: state ? state.name : '',
            stateCode: e.target.value,
            district: ''
        });
    };

    const handleCityChange = (e) => {
        setFormData({
            ...formData,
            district: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Pincode Validation (numeric)
        if (!/^\d+$/.test(formData.pincode)) {
            setError('Pincode must be numeric.');
            return;
        }

        // Address Lane Validation (alphanumeric + spaces)
        const alphaNumericSpace = /^[a-zA-Z0-9\s,.-/]+$/; // Allowing some common address symbols
        if (!alphaNumericSpace.test(formData.lane1)) {
            setError('Address Lane 1 contains invalid characters.');
            return;
        }
        if (formData.lane2 && !alphaNumericSpace.test(formData.lane2)) {
            setError('Address Lane 2 contains invalid characters.');
            return;
        }

        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Lane 1</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--color-gold)]/50 transition-colors"
                        value={formData.lane1}
                        onChange={(e) => setFormData({ ...formData, lane1: e.target.value })}
                        placeholder="House No, Building Name"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Lane 2</label>
                    <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--color-gold)]/50 transition-colors"
                        value={formData.lane2}
                        onChange={(e) => setFormData({ ...formData, lane2: e.target.value })}
                        placeholder="Area, Street, Sector"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Country</label>
                    <select
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--color-gold)]/50 transition-colors appearance-none"
                        value={formData.countryCode}
                        onChange={handleCountryChange}
                    >
                        <option value="" className="bg-[#050508]">Select Country</option>
                        {countries.map(c => (
                            <option key={c.isoCode} value={c.isoCode} className="bg-[#050508]">{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">State</label>
                    <select
                        required
                        disabled={!formData.countryCode}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--color-gold)]/50 transition-colors appearance-none disabled:opacity-50"
                        value={formData.stateCode}
                        onChange={handleStateChange}
                    >
                        <option value="" className="bg-[#050508]">Select State</option>
                        {states.map(s => (
                            <option key={s.isoCode} value={s.isoCode} className="bg-[#050508]">{s.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">District / City</label>
                    <select
                        required
                        disabled={!formData.stateCode}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--color-gold)]/50 transition-colors appearance-none disabled:opacity-50"
                        value={formData.district}
                        onChange={handleCityChange}
                    >
                        <option value="" className="bg-[#050508]">Select District</option>
                        {cities.map(c => (
                            <option key={c.name} value={c.name} className="bg-[#050508]">{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Pincode</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--color-gold)]/50 transition-colors"
                        value={formData.pincode}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, pincode: value });
                        }}
                        placeholder="682001"
                        inputMode="numeric"
                        pattern="\d*"
                    />
                </div>
                <div className="flex items-center space-x-3 pt-8">
                    <input
                        type="checkbox"
                        id="isDefault"
                        className="w-5 h-5 bg-white/5 border border-white/10 rounded focus:ring-[color:var(--color-gold)] accent-[color:var(--color-gold)]"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    />
                    <label htmlFor="isDefault" className="text-sm text-white/70">Set as default address</label>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white/70 flex items-center justify-center"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-[2] bg-[color:var(--color-gold)] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Address
                </button>
            </div>
        </form>
    );
}
