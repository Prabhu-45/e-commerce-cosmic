import { create } from 'zustand'

export const useStore = create((set) => ({
    gravityMode: false,
    setGravityMode: (val) => set({ gravityMode: val }),
    activeCollection: 'All',
    setActiveCollection: (val) => set({ activeCollection: val }),
    cart: [],
    addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
    removeFromCart: (index) => set((state) => ({
        cart: state.cart.filter((_, i) => i !== index)
    })),
    isCartOpen: false,
    setIsCartOpen: (val) => set({ isCartOpen: val }),

    wishlist: [],
    toggleWishlist: (product) => set((state) => {
        const isInWishlist = state.wishlist.some(item => item.id === product.id);
        if (isInWishlist) {
            return { wishlist: state.wishlist.filter(item => item.id !== product.id) };
        } else {
            return { wishlist: [...state.wishlist, product] };
        }
    }),

    // Auth State
    user: null,
    setUser: (userData) => set({ user: userData }),
    isAuthModalOpen: false,
    setAuthModalOpen: (val) => set({ isAuthModalOpen: val }),

    // Profile State
    isProfileOpen: false,
    setIsProfileOpen: (val) => set({ isProfileOpen: val }),
    luxuryCoins: 1250, // Mock initial balance
}))
