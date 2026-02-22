import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const containerRef = useRef();

    useGSAP(() => {
        const texts = gsap.utils.toArray('.anim-text');

        gsap.from(texts, {
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full max-w-4xl mx-auto px-6 py-40 min-h-[70vh] flex flex-col justify-center z-10 relative">
            <div className="glass-panel p-10 md:p-16 border-white/5 bg-black/40">
                <h2 className="anim-text text-lg tracking-[0.4em] uppercase text-[color:var(--color-gold)] mb-8 font-semibold">Our Story</h2>
                <p className="anim-text text-3xl md:text-5xl font-serif text-white leading-tight mb-8">
                    Born from the void, crafted with precision. We bring the elegance of the cosmos to your reality.
                </p>
                <p className="anim-text text-lg text-gray-400 font-sans max-w-2xl leading-relaxed">
                    Every artifact is meticulously forged to reflect the beauty of celestial bodies. Our commitment to dark luxury ensures that you wear not just an accessory, but a piece of the universe. Explore the unknown with confidence and exceptional style.
                </p>
            </div>
        </section>
    );
}
