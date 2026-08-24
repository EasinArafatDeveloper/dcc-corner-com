import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
} | null;

type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

interface StoreState {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  
  isAuthModalOpen: boolean;
  authModalMode: 'signup' | 'login';
  openAuthModal: (mode?: 'signup' | 'login') => void;
  closeAuthModal: () => void;

  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  wishlist: string[]; // Array of product IDs
  toggleWishlist: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      
      isAuthModalOpen: false,
      authModalMode: 'signup',
      openAuthModal: (mode = 'signup') => set({ isAuthModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      cart: [],
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find(i => i._id === item._id);
        if (existingItem) {
          return {
            cart: state.cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i),
            isCartOpen: true
          };
        }
        return { cart: [...state.cart, item], isCartOpen: true };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(i => i._id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map(i => i._id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ cart: [] }),
      
      wishlist: [],
      toggleWishlist: (id) => set((state) => ({
        wishlist: state.wishlist.includes(id) 
          ? state.wishlist.filter(i => i !== id) 
          : [...state.wishlist, id]
      })),
    }),
    {
      name: 'dcc-corner-storage',
    }
  )
);
