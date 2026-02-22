import React, { Component, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { supabase } from './lib/supabaseClient';
import { useStore } from './store/useStore';

import Scene from './components/canvas/Scene';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import CartIcon from './components/ui/CartIcon';
import CartDrawer from './components/ui/CartDrawer';
import AuthModal from './components/ui/AuthModal';
import ProfileIcon from './components/ui/ProfileIcon';
import ProfileDrawer from './components/ui/ProfileDrawer';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Caught error:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', zIndex: 9999, position: 'absolute', background: 'black', padding: '20px', width: '100vw', height: '100vh', overflow: 'auto' }}>
          <h1>React Crashed:</h1>
          <p>{this.state.error?.toString()}</p>
          <pre style={{ fontSize: '10px', marginTop: '10px' }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const mainRef = useRef();
  const setUser = useStore((state) => state.setUser);

  // Hydrate auth state on load
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  useGSAP(() => {
    gsap.from(mainRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    });
  }, { scope: mainRef });

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Global 3D Canvas Background */}
        <div className="fixed inset-0 z-[-10] w-full h-full bg-[#050508]">
          <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            eventSource={document.body}
            eventPrefix="client"
          >
            <Scene />
          </Canvas>
        </div>

        <main ref={mainRef} className="relative w-full overflow-x-hidden">
          <CartIcon />
          <CartDrawer />
          <ProfileIcon />
          <ProfileDrawer />
          <AuthModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection/:id" element={<Collection />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
