import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import AddressForm from './AddressForm';

export default function AddressManager() {
    const { user, addresses, fetchAddresses, addAddress, updateAddress, deleteAddress } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (user) {
            fetchAddresses(user.id);
        }
    }, [user, fetchAddresses]);

    const handleSave = async (data) => {
        if (editingId) {
            await updateAddress(editingId, data);
            setEditingId(null);
        } else {
            await addAddress({ ...data, userId: user.id });
            setIsAdding(false);
        }
    };

    if (isAdding || editingId) {
        const initialData = editingId ? addresses.find(a => a._id === editingId) : null;
        return (
            <div className="mt-8">
                <h3 className="text-xl font-serif text-white mb-6">
                    {editingId ? 'Edit Address' : 'Add New Address'}
                </h3>
                <AddressForm
                    onSave={handleSave}
                    onCancel={() => { setIsAdding(false); setEditingId(null); }}
                    initialData={initialData}
                />
            </div>
        );
    }

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-[color:var(--color-gold)]" />
                    Saved Addresses
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-xs uppercase tracking-widest text-[color:var(--color-gold)] hover:text-white transition-colors flex items-center"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add New
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-2 border-white/10">
                    <p className="text-white/40 italic">No addresses saved yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div key={address._id} className="glass-panel p-6 rounded-2xl border border-white/10 group hover:border-[color:var(--color-gold)]/30 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center">
                                        <p className="text-white font-medium">{address.lane1}</p>
                                        {address.isDefault && (
                                            <span className="ml-3 text-[10px] uppercase tracking-tighter bg-[color:var(--color-gold)]/20 text-[color:var(--color-gold)] px-2 py-0.5 rounded-full border border-[color:var(--color-gold)]/30">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/60 text-sm">{address.lane2}</p>
                                    <p className="text-white/60 text-sm">
                                        {address.district}, {address.state}, {address.country} - {address.pincode}
                                    </p>
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingId(address._id)}
                                        className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteAddress(address._id)}
                                        className="p-2 hover:bg-red-500/10 rounded-full text-white/50 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
