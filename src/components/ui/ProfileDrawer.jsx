import React, { useEffect, useRef } from 'react';
import { X, ShoppingBag, Heart, Ticket, HelpCircle, LogOut, Coins, User as UserIcon, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabaseClient';

export default function ProfileDrawer() {
    const { isProfileOpen, setIsProfileOpen, user, luxuryCoins, wishlist, toggleWishlist } = useStore();
    const [view, setView] = React.useState('menu'); // 'menu' or 'wishlist'
    const drawerRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isProfileOpen) {
            document.body.style.overflow = 'hidden';
            gsap.to(overlayRef.current, { opacity: 0.5, pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' });
            gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power3.out' });
        } else {
            document.body.style.overflow = 'auto';
            gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.inOut' });
            gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.inOut' });
            // Reset view on close
            setTimeout(() => setView('menu'), 400);
        }
    }, [isProfileOpen]);


    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsProfileOpen(false);
    };

    const menuItems = [
        { icon: ShoppingBag, label: 'My Orders', desc: 'Track your acquisitions', id: 'orders' },
        { icon: Heart, label: 'Wishlist', desc: 'Your desired artifacts', id: 'wishlist' },
        { icon: Ticket, label: 'Coupons', desc: 'Luxury privileges', id: 'coupons' },
        { icon: HelpCircle, label: 'Help Center', desc: 'Support & Guidance', id: 'help' },
    ];


    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black z-[60] opacity-0 pointer-events-none"
                onClick={() => setIsProfileOpen(false)}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-[#050508]/95 backdrop-blur-xl border-l border-white/10 z-[70] transform translate-x-full flex flex-col shadow-2xl"
            >
                {/* Header / User Profile */}
                <div className="p-8 border-b border-white/10 relative">
                    <button
                        onClick={() => setIsProfileOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-6 mt-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[color:var(--color-gold)]/20 to-white/5 border border-white/10 flex items-center justify-center relative group overflow-hidden">
                            <UserIcon className="w-10 h-10 text-[color:var(--color-gold)]" />
                            <div className="absolute inset-0 bg-[color:var(--color-gold)]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <p className="text-[color:var(--color-gold)] text-[10px] tracking-[0.3em] uppercase mb-1">Authenticated Resident</p>
                            <h2 className="text-2xl font-serif text-white tracking-widest truncate max-w-[220px]">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Explorer'}
                            </h2>
                        </div>
                    </div>

                    {/* Luxury Coins Stats */}
                    <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-[color:var(--color-gold)]/30 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[color:var(--color-gold)]/10 text-[color:var(--color-gold)]">
                                <Coins className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">Luxury Coins</p>
                                <p className="text-white font-sans font-bold tracking-widest">{luxuryCoins.toLocaleString()}</p>
                            </div>
                        </div>
                        <button className="text-[10px] text-[color:var(--color-gold)] uppercase tracking-[0.2em] font-bold border-b border-[color:var(--color-gold)]/0 hover:border-[color:var(--color-gold)] transition-all">
                            Details
                        </button>
                    </div>
                </div>

                {/* Content based on view */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    {view === 'menu' ? (
                        <div className="space-y-4">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => item.id === 'wishlist' && setView('wishlist')}
                                    className="w-full flex items-center gap-5 p-5 rounded-2xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left"
                                >
                                    <div className="p-3 rounded-xl bg-white/5 text-white/40 group-hover:text-[color:var(--color-gold)] transition-colors">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-serif text-lg tracking-wider group-hover:text-[color:var(--color-gold)] transition-colors">
                                            {item.label}
                                        </h3>
                                        <p className="text-white/30 text-xs tracking-wide">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={() => setView('menu')}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-2xl font-serif text-white tracking-widest uppercase">Wishlist</h3>
                            </div>

                            {wishlist.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                                    <Heart className="w-12 h-12 text-white/10 mb-4" />
                                    <p className="text-white/30 text-sm tracking-widest uppercase">Your nebula is empty</p>
                                    <button
                                        onClick={() => setIsProfileOpen(false)}
                                        className="mt-6 text-[color:var(--color-gold)] text-xs tracking-widest uppercase border-b border-[color:var(--color-gold)] hover:text-white hover:border-white transition-all"
                                    >
                                        Explore Products
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {wishlist.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 relative group">
                                            <div className="w-16 h-20 rounded-lg overflow-hidden bg-black/50 shrink-0">
                                                <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-screen opacity-80" />
                                            </div>
                                            <div className="flex flex-col justify-center flex-1">
                                                <h4 className="text-white font-serif text-base tracking-wide leading-tight mb-1">{item.title}</h4>
                                                <p className="text-[color:var(--color-gold)] font-sans text-sm tracking-widest">{item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleWishlist(item)}
                                                className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                                title="Remove from wishlist"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer / Sign Out */}
                <div className="p-8 border-t border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/50 transition-all tracking-[0.3em] uppercase text-xs font-bold"
                    >
                        <LogOut className="w-4 h-4" />
                        Depart Orbital
                    </button>
                </div>
            </div>
        </>
    );
}
