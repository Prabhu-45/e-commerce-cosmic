import React from 'react';
import { User } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ProfileIcon() {
    const setIsProfileOpen = useStore((state) => state.setIsProfileOpen);
    const user = useStore((state) => state.user);
    const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);

    const handleClick = () => {
        if (user) {
            setIsProfileOpen(true);
        } else {
            setAuthModalOpen(true);
        }
    };

    return (
        <div
            className="fixed top-8 right-24 z-50 mix-blend-difference cursor-pointer"
            onClick={handleClick}
        >
            <div className="relative p-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-colors group">
                <User className="w-5 h-5 pointer-events-none group-hover:scale-110 transition-transform" />
                {user && (
                    <div className="absolute -top-1 -right-1 bg-[color:var(--color-gold)] w-2.5 h-2.5 rounded-full shadow-lg" />
                )}
            </div>
        </div>
    );
}
