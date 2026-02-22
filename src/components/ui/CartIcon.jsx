import React, { useRef, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import gsap from 'gsap';

export default function CartIcon() {
    const cart = useStore((state) => state.cart) || [];
    const setIsCartOpen = useStore((state) => state.setIsCartOpen);
    const iconRef = useRef(null);
    const badgeRef = useRef(null);
    const prevCartLength = useRef(cart.length);

    useEffect(() => {
        if (cart.length > prevCartLength.current && iconRef.current) {
            // Animate on item added
            gsap.fromTo(iconRef.current,
                { scale: 1 },
                { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
            );
            if (badgeRef.current) {
                gsap.fromTo(badgeRef.current,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            }
        }
        prevCartLength.current = cart.length;
    }, [cart.length]);

    if (cart.length === 0) return null;

    return (
        <div
            className="fixed top-8 right-8 z-50 mix-blend-difference cursor-pointer"
            ref={iconRef}
            onClick={() => setIsCartOpen(true)}
        >
            <div className="relative p-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                <ShoppingCart className="w-5 h-5 pointer-events-none" />
                <div
                    ref={badgeRef}
                    className="absolute -top-1 -right-1 bg-[color:var(--color-gold)] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                >
                    {cart.length}
                </div>
            </div>
        </div>
    );
}
