import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { collectionsData } from '../data/products';
import Footer from '../components/sections/Footer';
import { useStore } from '../store/useStore';
import { ArrowLeft, Heart } from 'lucide-react';

export default function Collection() {
    const { id } = useParams();
    const navigate = useNavigate();
    // Reconstruct title from URL param (e.g. 'black-hole' -> 'Black Hole')
    const collectionTitle = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const products = collectionsData[collectionTitle] || [];
    const addToCart = useStore(state => state.addToCart);
    const wishlist = useStore(state => state.wishlist) || [];
    const toggleWishlist = useStore(state => state.toggleWishlist);
    const user = useStore(state => state.user);
    const setAuthModalOpen = useStore(state => state.setAuthModalOpen);

    const handleAddToCart = (e, product) => {
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

    const handleToggleWishlist = (e, product) => {
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


    useEffect(() => {
        window.scrollTo(0, 0);

        // Simple entrance animation
        gsap.fromTo('.collection-item',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
        );
    }, [id]);

    if (!products.length) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-white z-10 relative">
                <h1 className="text-4xl font-serif mb-4">Collection Not Found</h1>
                <Link to="/" className="text-[color:var(--color-gold)] hover:text-white transition-colors underline underline-offset-4">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 relative z-10 flex flex-col">
            <div className="max-w-7xl mx-auto px-6 w-full flex-grow">

                <Link to="/" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="mb-16 border-b border-white/10 pb-8">
                    <p className="text-[color:var(--color-gold)] tracking-[0.3em] text-sm font-semibold uppercase mb-4">The Complete Inventory</p>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-widest leading-tight">
                        {collectionTitle}
                    </h1>
                    <p className="text-white/60 mt-6 max-w-2xl text-lg">
                        Explore the full spectrum of our {collectionTitle} artifacts. Each piece is forged in the heart of celestial phenomena, designed for those who command gravity itself.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`)}
                            className={`collection-item glass-panel p-8 flex flex-col justify-between min-h-[450px] overflow-hidden group cursor-pointer ${product.span}`}
                        >
                            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-80 transition-opacity duration-700 bg-black">
                                <img
                                    src={product.img}
                                    alt={product.title}
                                    className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent"></div>
                            </div>

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-[color:var(--color-gold)] text-xs tracking-[0.2em] uppercase mb-1">{product.category}</p>
                                    <h3 className="text-3xl font-serif mb-2 tracking-wide text-white drop-shadow-lg">{product.title}</h3>
                                </div>
                                <button
                                    onClick={(e) => handleToggleWishlist(e, product)}
                                    className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${wishlist.some(item => item.id === product.id) ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:border-white/30'}`}
                                >
                                    <Heart className={`w-5 h-5 ${wishlist.some(item => item.id === product.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <div className="relative z-10 mt-auto flex justify-end">
                                <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="liquid-btn border border-white/20 rounded-full overflow-hidden w-auto self-end backdrop-blur-md px-6 py-3"
                                >
                                    <span className="relative z-10 transition-colors duration-300 text-sm tracking-uppercase tracking-widest uppercase">
                                        Add to Cart
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
