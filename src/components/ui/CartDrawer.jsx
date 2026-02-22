import React, { useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function CartDrawer() {
    const { cart, removeFromCart, isCartOpen, setIsCartOpen, user } = useStore();
    const drawerRef = useRef(null);
    const overlayRef = useRef(null);
    const navigate = useNavigate();

    // Calculate total
    const total = cart.reduce((sum, item) => {
        const priceStr = item.price.replace('$', '').replace(',', '');
        return sum + parseFloat(priceStr);
    }, 0);

    useEffect(() => {
        if (isCartOpen) {
            // Open animation
            document.body.style.overflow = 'hidden';
            gsap.to(overlayRef.current, { opacity: 0.5, pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' });
            gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power3.out' });
        } else {
            // Close animation
            document.body.style.overflow = 'auto';
            gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.inOut' });
            gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.inOut' });
        }
    }, [isCartOpen]);

    const handleCheckout = () => {
        // Placeholder for checkout logic
        setIsCartOpen(false);
        // Could navigate to a checkout page here
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black z-[60] opacity-0 pointer-events-none"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-[#050508]/95 backdrop-blur-xl border-l border-white/10 z-[70] transform translate-x-full flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-serif text-white tracking-widest">YOUR ORBIT</h2>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    {user && (
                        <div className="flex justify-between items-center text-xs tracking-widest uppercase text-white/50">
                            <span>{user.email}</span>
                            <button onClick={handleSignOut} className="hover:text-white transition-colors">Sign Out</button>
                        </div>
                    )}
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/50">
                            <p className="tracking-widest uppercase mb-4 text-xs">No artifacts acquired yet</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-[color:var(--color-gold)] font-serif italic text-lg hover:text-white transition-colors"
                            >
                                Continue Exploration
                            </button>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 relative group">
                                <div className="w-20 h-24 rounded-lg overflow-hidden bg-black/50 shrink-0">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-screen opacity-80" />
                                </div>
                                <div className="flex flex-col justify-center flex-1">
                                    <p className="text-[color:var(--color-gold)] text-[10px] tracking-[0.2em] uppercase mb-1">{item.category}</p>
                                    <h3 className="text-white font-serif text-lg leading-tight mb-2">{item.title}</h3>
                                    <p className="text-white/80 font-sans tracking-widest text-sm">{item.price}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(index)}
                                    className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Remove artifact"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-black/20">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-white/60 uppercase tracking-widest text-xs">Total Mass</span>
                            <span className="text-white font-sans text-2xl font-bold tracking-widest">
                                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full liquid-btn border border-[color:var(--color-gold)] bg-[color:var(--color-gold)]/10 hover:bg-[color:var(--color-gold)] text-[color:var(--color-gold)] hover:text-black rounded-full py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                        >
                            Initiate Transfer
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
