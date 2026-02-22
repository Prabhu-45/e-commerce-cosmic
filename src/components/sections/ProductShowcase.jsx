import { useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '../../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

import { getAllProductsList } from '../../data/products';

const allProducts = getAllProductsList();

// Curated featured display: Nebula Chrono, Singularity Watch, Eclipse Pendant, Obsidian Watch
const featuredIds = ['sn-1', 'bh-2', 'sf-1', 'dm-2'];
const featuredProducts = allProducts.filter(p => featuredIds.includes(p.id));

function ProductCard({ product }) {
    const cardRef = useRef();
    const imageRef = useRef();
    const navigate = useNavigate();
    const addToCart = useStore(state => state.addToCart);
    const wishlist = useStore(state => state.wishlist) || [];
    const toggleWishlist = useStore(state => state.toggleWishlist);
    const user = useStore(state => state.user);
    const setAuthModalOpen = useStore(state => state.setAuthModalOpen);

    const handleAddToCart = (e) => {
        e.stopPropagation();

        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        addToCart(product);
        gsap.fromTo(e.currentTarget,
            { scale: 0.95, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            { scale: 1, backgroundColor: 'transparent', duration: 0.4, ease: "elastic.out(1, 0.5)" }
        );
    };

    const handleToggleWishlist = (e) => {
        e.stopPropagation();
        if (!user) {
            setAuthModalOpen(true);
            return;
        }
        toggleWishlist(product);

        // Heart animation
        gsap.fromTo(e.currentTarget,
            { scale: 0.8 },
            { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, ease: "back.out(2)" }
        );
    };

    const isInWishlist = wishlist.some(item => item.id === product.id);


    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt effect limits
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out"
        });

        gsap.to(imageRef.current, {
            scale: 1.05,
            x: rotateY * 2,
            y: -rotateX * 2,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.7,
            ease: "power2.out"
        });
        gsap.to(imageRef.current, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "power2.out"
        });
    };

    const handleClick = () => {
        navigate(`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={`glass-panel p-8 flex flex-col justify-between min-h-[450px] overflow-hidden group cursor-pointer ${product.span}`}
        >
            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-80 transition-opacity duration-700 bg-black">
                <img
                    ref={imageRef}
                    src={product.img}
                    alt={product.title}
                    className="w-full h-full object-cover opacity-60 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent"></div>
            </div>

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-[color:var(--color-gold)] text-xs tracking-[0.2em] uppercase mb-1">{product.category}</p>
                    <h3 className="text-3xl font-serif mb-2 tracking-wide text-white drop-shadow-lg">{product.title}</h3>
                </div>
                <button
                    onClick={handleToggleWishlist}
                    className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${isInWishlist ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:border-white/30'}`}
                >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className="relative z-10 mt-auto flex justify-end">
                <button
                    onClick={handleAddToCart}
                    className="liquid-btn border border-white/20 rounded-full overflow-hidden w-auto self-end backdrop-blur-md px-6 py-3"
                >
                    <span className="relative z-10 transition-colors duration-300 text-sm tracking-uppercase tracking-widest uppercase">
                        Add to Cart
                    </span>
                </button>
            </div>
        </div>
    );
}

export default function ProductShowcase() {
    const activeCollection = useStore((state) => state.activeCollection);
    const setActiveCollection = useStore((state) => state.setActiveCollection);

    const filteredProducts = activeCollection === 'All'
        ? featuredProducts
        : allProducts.filter(p => p.category === activeCollection);

    // Tabs
    const collections = ['All', 'Supernova', 'Black Hole', 'Milky Way', 'Solar Flare', 'Dark Matter'];

    return (
        <section id="products-section" className="w-full max-w-7xl mx-auto px-6 py-32 z-10 relative scroll-mt-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-white/10 pb-6 gap-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-4">
                        CURATED<br /><span className="text-[color:var(--color-gold)] font-serif italic">Orbits</span>
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {collections.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCollection(cat)}
                                className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-300 border ${activeCollection === cat ? 'border-[color:var(--color-gold)] bg-[color:var(--color-gold)] text-black font-bold' : 'border-white/20 text-white/70 hover:border-white/50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <p className="text-gray-400 max-w-xs text-left md:text-right text-sm">Discover our exclusive collection of cosmic artifacts and luxury wearables. Browse by celestial phenomenon.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <p className="text-white col-span-full">No products found in this collection.</p>
                )}
            </div>

            {activeCollection !== 'All' && (
                <div className="mt-16 flex justify-center">
                    <Link
                        to={`/collection/${activeCollection.toLowerCase().replace(' ', '-')}`}
                        className="liquid-btn border border-[color:var(--color-gold)] text-[color:var(--color-gold)] rounded-full overflow-hidden backdrop-blur-md px-8 py-4 px-12 group"
                    >
                        <span className="relative z-10 transition-colors duration-300 text-sm tracking-[0.2em] uppercase font-semibold group-hover:text-black">
                            Explore All {activeCollection}
                        </span>
                    </Link>
                </div>
            )}
        </section>
    );
}
