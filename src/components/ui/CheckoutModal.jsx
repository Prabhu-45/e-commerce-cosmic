import React, { useState, useEffect } from 'react';
import { X, Check, Plus, ArrowRight, User, MapPin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import AddressForm from './AddressForm';

export default function CheckoutModal({ isOpen, onClose, product = null, isCart = false }) {
    const { user, addresses, fetchAddresses, addAddress, cart, createOrder } = useStore();
    const [step, setStep] = useState('select'); // 'select' or 'add'
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const itemsToBuy = isCart ? cart : (product ? [product] : []);
    const totalPrice = itemsToBuy.reduce((sum, item) => {
        const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + priceNum;
    }, 0);

    const formattedTotal = `$${totalPrice.toLocaleString()}`;

    useEffect(() => {
        if (isOpen && user) {
            fetchAddresses(user.id);
        }
    }, [isOpen, user, fetchAddresses]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            setSelectedAddressId(defaultAddr._id);
        }
    }, [addresses, selectedAddressId]);

    if (!isOpen) return null;

    const handleProceed = async () => {
        const address = addresses.find(a => a._id === selectedAddressId);
        if (!address) return;

        setIsProcessing(true);

        const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Unknown';

        const orderData = {
            userId: user.id,
            username,
            products: itemsToBuy.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                img: item.img,
                quantity: 1
            })),
            address: {
                lane1: address.lane1,
                lane2: address.lane2,
                country: address.country,
                state: address.state,
                district: address.district,
                pincode: address.pincode
            },
            total: formattedTotal,
            status: "Payment Incomplete"
        };

        await createOrder(orderData);

        setIsProcessing(false);
        setIsSuccess(true);
    };

    const handleSaveAddress = async (data) => {
        await addAddress({ ...data, userId: user.id });
        setStep('select');
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
                <div className="glass-panel max-w-md w-full p-12 rounded-[2rem] border border-[color:var(--color-gold)]/30 text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-[color:var(--color-gold)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-[color:var(--color-gold)]" />
                    </div>
                    <h2 className="text-3xl font-serif text-white mb-4">Acquisition Complete</h2>
                    <p className="text-white/60 mb-2">Order status: <span className="text-red-400">Payment Incomplete</span></p>
                    <p className="text-white/60 mb-8">Your items are now reserved in your dashboard under "My Orders".</p>
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-[color:var(--color-gold)] text-black font-bold rounded-xl hover:bg-white transition-colors uppercase tracking-[0.2em] text-sm"
                    >
                        Return to Universe
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/40">
            <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-[2rem] border border-white/10 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-2xl font-serif text-white tracking-widest uppercase">Secure Acquisition</h2>
                        <p className="text-[10px] text-[color:var(--color-gold)] uppercase tracking-[0.3em] mt-1 italic">Celestial Transaction Protocol</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Product Summary */}
                    <div className="space-y-3">
                        {itemsToBuy.map((item, idx) => (
                            <div key={idx} className="flex gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 items-center">
                                <div className="w-16 h-20 rounded-lg overflow-hidden bg-black/50">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-screen opacity-80" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-serif text-base tracking-wide">{item.title}</h3>
                                    <p className="text-[color:var(--color-gold)] font-sans text-lg font-bold">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {step === 'select' ? (
                        <>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-white text-sm uppercase tracking-widest flex items-center italic">
                                        <MapPin className="w-4 h-4 mr-2 text-[color:var(--color-gold)]" />
                                        Select Destination
                                    </h4>
                                    <button
                                        onClick={() => setStep('add')}
                                        className="text-[10px] uppercase tracking-widest text-[color:var(--color-gold)] hover:text-white transition-colors flex items-center"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        New Coordinate
                                    </button>
                                </div>

                                {addresses.length === 0 ? (
                                    <button
                                        onClick={() => setStep('add')}
                                        className="w-full p-8 rounded-2xl border-2 border-dashed border-white/10 text-white/30 hover:text-[color:var(--color-gold)] hover:border-[color:var(--color-gold)]/30 transition-all flex flex-col items-center gap-3 bg-white/0 hover:bg-white/5"
                                    >
                                        <Plus className="w-8 h-8" />
                                        <span className="text-xs uppercase tracking-[0.2em] font-bold">Add Delivery Address</span>
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr._id}
                                                onClick={() => setSelectedAddressId(addr._id)}
                                                className={`p-6 rounded-2xl border cursor-pointer transition-all group ${selectedAddressId === addr._id ? 'bg-[color:var(--color-gold)]/10 border-[color:var(--color-gold)]/50' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center ${selectedAddressId === addr._id ? 'border-[color:var(--color-gold)]' : 'border-white/20'}`}>
                                                        {selectedAddressId === addr._id && <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--color-gold)]" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{addr.lane1}</p>
                                                        <p className="text-white/50 text-xs mt-1">{addr.district}, {addr.state}, {addr.country}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Payment Summary */}
                            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                                <div className="flex justify-between text-xs tracking-widest text-white/40 uppercase">
                                    <span>Subtotal</span>
                                    <span className="text-white/80">{formattedTotal}</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest text-white/40 uppercase">
                                    <span>Celestial Logistics</span>
                                    <span className="text-[color:var(--color-gold)] font-bold">Complimentary</span>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between text-lg font-serif text-white tracking-widest uppercase">
                                    <span>Total Value</span>
                                    <span className="text-[color:var(--color-gold)]">{formattedTotal}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={() => setStep('select')}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <h4 className="text-white text-sm uppercase tracking-widest">Add New Coordinates</h4>
                            </div>
                            <AddressForm onSave={handleSaveAddress} onCancel={() => setStep('select')} />
                        </div>
                    )}
                </div>

                {/* Action Footer */}
                {step === 'select' && (
                    <div className="p-8 border-t border-white/10 bg-white/5">
                        <button
                            disabled={!selectedAddressId || isProcessing}
                            onClick={handleProceed}
                            className={`w-full py-5 rounded-xl font-bold uppercase tracking-[0.3em] text-sm flex items-center justify-center transition-all ${!selectedAddressId || isProcessing ? 'bg-white/10 text-white/20 cursor-not-allowed' : 'bg-[color:var(--color-gold)] text-black hover:bg-white hover:scale-[1.02]'}`}
                        >
                            {isProcessing ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-3" />
                                    Authorizing...
                                </div>
                            ) : (
                                <>
                                    Complete Acquisition
                                    <ArrowRight className="w-4 h-4 ml-3" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
