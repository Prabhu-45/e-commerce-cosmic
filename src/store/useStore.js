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

    // Address State
    addresses: [],
    fetchAddresses: async (userId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/addresses/${userId}`);
            const data = await res.json();
            set({ addresses: data });
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    },
    addAddress: async (addressData) => {
        const { user } = useStore.getState();
        const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Unknown';

        try {
            const res = await fetch('http://localhost:5000/api/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...addressData, username })
            });
            const newAddress = await res.json();
            set((state) => ({ addresses: [...state.addresses, newAddress] }));
        } catch (error) {
            console.error('Error adding address:', error);
        }
    },
    updateAddress: async (id, addressData) => {
        try {
            const res = await fetch(`http://localhost:5000/api/addresses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });
            const updatedAddress = await res.json();
            set((state) => ({
                addresses: state.addresses.map(a => a._id === id ? updatedAddress : a)
            }));
        } catch (error) {
            console.error('Error updating address:', error);
        }
    },
    deleteAddress: async (id) => {
        try {
            await fetch(`http://localhost:5000/api/addresses/${id}`, {
                method: 'DELETE'
            });
            set((state) => ({
                addresses: state.addresses.filter(a => a._id !== id)
            }));
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    },

    // Order State
    orders: [],
    fetchOrders: async (userId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${userId}`);
            const data = await res.json();
            set({ orders: data });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    },
    createOrder: async (orderData) => {
        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const newOrder = await res.json();
            set((state) => ({
                orders: [newOrder, ...state.orders],
                cart: orderData.products.length > 1 ? [] : state.cart // Clear cart if it was a cart checkout
            }));
            return newOrder;
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }
}))
