import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useStore } from '../../store/useStore';

export default function Hero() {
    const container = useRef();
    const titleRef = useRef();
    const setGravityMode = useStore((state) => state.setGravityMode);

    const title = "DARK LUXURY";

    useGSAP(() => {
        gsap.from(titleRef.current.children, {
            y: 100,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.5
        });
    }, { scope: container });

    return (
        <section
            ref={container}
            className="h-screen w-full flex flex-col items-center justify-center relative select-none z-10"
        >
            <div className="overflow-hidden mb-6 py-4">
                <h1
                    ref={titleRef}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold text-center tracking-wider text-white"
                >
                    {title.split('').map((char, i) => (
                        <span key={i} className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-xl text-center mb-10 opacity-80 font-light tracking-wide">
                Experience the cosmos. Hold click to engage Gravity Zone.
            </p>
            <button
                className="glass-panel liquid-btn px-10 py-4 text-sm tracking-[0.3em] uppercase font-semibold text-[color:var(--color-gold)] transition-colors"
                onPointerDown={() => setGravityMode(true)}
                onPointerUp={() => setGravityMode(false)}
                onPointerLeave={() => setGravityMode(false)}
            >
                <span className="relative z-10">Engage Gravity</span>
            </button>
        </section>
    );
}
