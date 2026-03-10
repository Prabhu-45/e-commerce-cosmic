import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ShoppingCart, CreditCard, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getAllProductsList } from '../data/products';
import Footer from '../components/sections/Footer';
import CheckoutModal from '../components/ui/CheckoutModal';

export default function ProductDetails() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const addToCart = useStore((state) => state.addToCart);
    const wishlist = useStore((state) => state.wishlist) || [];
    const toggleWishlist = useStore((state) => state.toggleWishlist);
    const user = useStore((state) => state.user);
    const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const cartBtnRef = useRef(null);
    const heartBtnRef = useRef(null);

    const handleBuyNow = () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }
        setIsCheckoutOpen(true);
    };

    const handleAddToCart = () => {
        if (!product) return;

        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        addToCart(product);

        // Button animation
        gsap.fromTo(cartBtnRef.current,
            { scale: 0.95, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            { scale: 1, backgroundColor: 'transparent', duration: 0.4, ease: "elastic.out(1, 0.5)" }
        );
    };

    const handleToggleWishlist = () => {
        if (!product || !user) {
            setAuthModalOpen(true);
            return;
        }
        toggleWishlist(product);

        // Heart animation
        gsap.fromTo(heartBtnRef.current,
            { scale: 0.8 },
            { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, ease: "back.out(2)" }
        );
    };

    const isInWishlist = product ? wishlist.some(item => item.id === product.id) : false;


    useEffect(() => {
        window.scrollTo(0, 0);
        const allProducts = getAllProductsList();
        // Match slugified title
        const found = allProducts.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === slug);

        if (found) {
            setProduct(found);
        }
    }, [slug]);

    useEffect(() => {
        if (product) {
            gsap.fromTo('.product-animate',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
            );
        }
    }, [product]);

    if (!product) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-white z-10 relative">
                <h1 className="text-4xl font-serif mb-4">Product Not Found</h1>
                <button onClick={() => navigate(-1)} className="text-[color:var(--color-gold)] hover:text-white transition-colors underline underline-offset-4">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 relative z-10 flex flex-col">
            <div className="max-w-7xl mx-auto px-6 w-full flex-grow mb-32">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-12 group cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Section */}
                    <div className="product-animate w-full aspect-[4/5] relative rounded-3xl overflow-hidden glass-panel group">
                        <div className="absolute inset-0 z-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700"></div>
                        <img
                            src={product.img}
                            alt={product.title}
                            className="w-full h-full object-cover mix-blend-screen opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050508] to-transparent opacity-80 pointer-events-none"></div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center">
                        <div className="product-animate mb-6 inline-block">
                            <Link
                                to={`/collection/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-[color:var(--color-gold)] text-xs tracking-[0.3em] uppercase border border-[color:var(--color-gold)]/30 rounded-full px-4 py-1.5 hover:bg-[color:var(--color-gold)] hover:text-black transition-colors"
                            >
                                {product.category} Collection
                            </Link>
                        </div>

                        <h1 className="product-animate text-5xl md:text-7xl font-serif font-bold text-white tracking-widest mb-4 drop-shadow-lg">
                            {product.title}
                        </h1>

                        <p className="product-animate text-3xl font-sans tracking-widest font-semibold text-white/90 drop-shadow-md mb-8">
                            {product.price}
                        </p>

                        <div className="product-animate h-px w-full bg-white/10 mb-8"></div>

                        <p className="product-animate text-white/60 text-lg leading-relaxed font-light mb-10 max-w-xl">
                            Forged from the elemental remnants of celestial events, the {product.title} bounds cosmic power into luxury form. Featuring extraordinary materials and peerless craftsmanship, it commands gravity and commands attention. Step into the dark luxury universe.
                        </p>

                        <div className="product-animate flex flex-col sm:flex-row gap-4 mt-4">
                            <button
                                ref={cartBtnRef}
                                onClick={handleAddToCart}
                                className="liquid-btn border border-white/20 rounded-full overflow-hidden w-full sm:w-auto flex-[2] backdrop-blur-md px-6 py-5 flex items-center justify-center group"
                            >
                                <span className="relative z-10 transition-colors duration-300 text-sm tracking-[0.2em] font-bold uppercase flex items-center">
                                    <ShoppingCart className="w-4 h-4 mr-3" />
                                    Add to Cart
                                </span>
                            </button>

                            <button
                                ref={heartBtnRef}
                                onClick={handleToggleWishlist}
                                className={`p-5 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center ${isInWishlist ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:border-white/30'}`}
                            >
                                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="liquid-btn border border-[color:var(--color-gold)] text-[color:var(--color-gold)] bg-[color:var(--color-gold)]/10 rounded-full overflow-hidden w-full sm:w-auto flex-[2] backdrop-blur-md px-6 py-5 flex items-center justify-center group hover:bg-transparent"
                            >
                                <span className="relative z-10 transition-colors duration-300 text-sm tracking-[0.2em] font-bold uppercase flex items-center group-hover:text-black text-white">
                                    <CreditCard className="w-4 h-4 mr-3" />
                                    Buy Now
                                </span>
                            </button>
                        </div>

                        {/* Additional info tabs could go here */}
                        <div className="product-animate mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <h4 className="text-white text-sm tracking-widest uppercase mb-2">Material</h4>
                                <p className="text-white/50 text-sm">Meteorite & Dark Matter Alloy</p>
                            </div>
                            <div>
                                <h4 className="text-white text-sm tracking-widest uppercase mb-2">Origin</h4>
                                <p className="text-white/50 text-sm">{product.category} Cluster</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={product}
            />
            <Footer />
        </div>
    );
}
