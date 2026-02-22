import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Footer() {
    const waveRef = useRef();

    useGSAP(() => {
        gsap.to(waveRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 15,
            ease: "linear"
        });
    }, []);

    return (
        <footer className="w-full bg-black/60 backdrop-blur-xl pt-32 pb-12 relative overflow-hidden mt-0 z-10">
            {/* Animated SVG Wave at top */}
            <div
                className="absolute top-0 left-0 w-[200%] h-32 md:h-48 text-[color:var(--color-violet)] opacity-20 pointer-events-none"
                ref={waveRef}
            >
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full fill-current">
                    <path d="M0,128L48,149.3C96,171,192,213,288,213.3C384,213,480,171,576,149.3C672,128,768,128,864,154.7C960,181,1056,235,1152,240C1248,245,1344,203,1392,181.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" opacity="0.3"></path>
                    <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,192C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 mt-12">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-3xl font-bold font-serif tracking-wider mb-6 text-white">DARK LUXURY</h2>
                    <p className="text-gray-400 max-w-xs text-sm leading-relaxed">Elevating your aesthetic to a cosmic dimension with premium, handcrafted wearables inspired by the universe.</p>
                </div>

                <div>
                    <h4 className="text-[color:var(--color-gold)] tracking-widest uppercase text-xs font-bold mb-6">Shop</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors duration-300 inline-block relative group">Watches<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 inline-block relative group">Rings<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 inline-block relative group">Pendants<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 inline-block relative group">Collections<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[color:var(--color-gold)] tracking-widest uppercase text-xs font-bold mb-6">About</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors duration-300 inline-block relative group">Our Story<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 inline-block relative group">Sustainability<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 inline-block relative group">Contact<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 inline-block relative group">FAQ<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 relative z-10 font-sans">
                <p>© 2026 Dark Luxury. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
