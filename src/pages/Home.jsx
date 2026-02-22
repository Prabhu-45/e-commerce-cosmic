import React from 'react';
import Hero from '../components/sections/Hero';
import ProductShowcase from '../components/sections/ProductShowcase';
import FeaturedCarousel from '../components/sections/FeaturedCarousel';
import About from '../components/sections/About';
import Footer from '../components/sections/Footer';

export default function Home() {
    return (
        <>
            <Hero />
            <ProductShowcase />
            <FeaturedCarousel />
            <About />
            <Footer />
        </>
    );
}
