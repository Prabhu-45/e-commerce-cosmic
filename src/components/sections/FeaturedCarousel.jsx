import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const items = [
    { id: 1, title: 'Supernova', img: 'https://plus.unsplash.com/premium_photo-1681399977843-3efee572acd4?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Z2FsYXh5JTIwc3RhcnMlMjBzcGFjZXxlbnwwfHx8fDE3NzE3NDM3NjB8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80' },
    { id: 2, title: 'Black Hole', img: 'https://images.unsplash.com/photo-1547534937-98473c3c0c00?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Z2FsYXh5JTIwc3RhcnMlMjBzcGFjZXxlbnwwfHx8fDE3NzE3NDM3NjB8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80' },
    { id: 3, title: 'Milky Way', img: 'https://images.unsplash.com/photo-1585575141647-c2c436949374?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Z2FsYXh5JTIwc3RhcnMlMjBzcGFjZXxlbnwwfHx8fDE3NzE3NDM3NjB8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80' },
    { id: 4, title: 'Solar Flare', img: 'https://images.unsplash.com/photo-1562204320-fd327f8ad4a2?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Z2FsYXh5JTIwc3RhcnMlMjBzcGFjZXxlbnwwfHx8fDE3NzE3NDM3NjB8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80' },
    { id: 5, title: 'Dark Matter', img: 'https://plus.unsplash.com/premium_photo-1733306532535-a9c18fc0602e?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Z2FsYXh5JTIwc3RhcnMlMjBzcGFjZXxlbnwwfHx8fDE3NzE3NDM3NjB8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80' },
];

export default function FeaturedCarousel() {
    const containerRef = useRef();
    const wrapperRef = useRef();

    useGSAP(() => {
        const mm = gsap.matchMedia();

        // Only apply horizontal scroll on desktop
        mm.add("(min-width: 768px)", () => {
            const sections = gsap.utils.toArray('.carousel-item');

            const scrollTween = gsap.to(wrapperRef.current, {
                x: () => -(wrapperRef.current.scrollWidth - window.innerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + wrapperRef.current.offsetWidth
                }
            });

            // Active scale effect mapping
            sections.forEach((sec) => {
                gsap.to(sec.querySelector('.img-container'), {
                    scale: 1.1,
                    ease: "power1.inOut",
                    scrollTrigger: {
                        trigger: sec,
                        containerAnimation: scrollTween,
                        start: "left center",
                        end: "right center",
                        scrub: true,
                    }
                });
            });
        });

        return () => mm.revert();
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full h-screen overflow-hidden relative flex items-center md:items-stretch z-10">
            <div
                ref={wrapperRef}
                className="flex flex-col md:flex-row w-full h-full md:h-screen items-center md:items-center md:w-[500vw]"
            >
                {items.map((item, i) => (
                    <div
                        key={item.id}
                        className="carousel-item w-full md:w-screen h-[50vh] md:h-full flex flex-col justify-center items-center px-10 py-10 md:py-20 shrink-0"
                    >
                        <Link
                            to={`/collection/${item.title.toLowerCase().replace(' ', '-')}`}
                            className="img-container relative w-full md:max-w-4xl aspect-[16/9] md:aspect-[4/3] rounded-3xl overflow-hidden group cursor-pointer block"
                        >
                            <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-14">
                                <p className="text-[color:var(--color-gold)] tracking-widest uppercase text-sm font-semibold mb-2">Featured Collection</p>
                                <h3 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-widest">{item.title}</h3>
                                <p className="text-white/70 mt-4 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to view the {item.title} collection in our product showcase.</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
