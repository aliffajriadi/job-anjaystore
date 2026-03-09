"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type PriceMode = "IDR_ONLY" | "DL_ONLY" | "BOTH";

export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: "IDR" | "DL";
  priceMode: PriceMode;
  priceDl?: number;
  priceIdr?: number;
  image: string;
  description: string;
  quantity: number;
  stock: number;
}

// Product shape coming from the API/page
interface ProductInput {
  id: number;
  name: string;
  category: string;
  priceIdr?: number;
  priceDl?: number;
  priceMode: PriceMode;
  image: string;
  description?: string;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductInput, currency: "IDR" | "DL") => void;
  removeFromCart: (id: number, currency: "IDR" | "DL") => void;
  updateQuantity: (id: number, currency: "IDR" | "DL", delta: number) => void;
  cartTotalIdr: number;
  cartTotalDl: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initialize from localStorage synchronously to avoid the effect-setState lint error
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cart");
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ProductInput, currency: "IDR" | "DL") => {
    const price =
      currency === "IDR" ? (product.priceIdr ?? 0) : (product.priceDl ?? 0);

    if (product.stock <= 0) {
      toast.error("Stok produk habis!");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.id === product.id && item.currency === currency,
      );

      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          toast.error("Stok tidak mencukupi!");
          return prevCart;
        }
        toast.success(`${product.name} ditambahkan ke keranjang`);
        return prevCart.map((item) =>
          item.id === product.id && item.currency === currency
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      toast.success(`${product.name} dimasukkan ke keranjang`);
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price,
          currency,
          priceMode: product.priceMode,
          priceDl: product.priceDl,
          priceIdr: product.priceIdr,
          image: product.image,
          description: product.description ?? "",
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  };

  const removeFromCart = (id: number, currency: "IDR" | "DL") => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === id && item.currency === currency),
      ),
    );
  };

  const updateQuantity = (
    id: number,
    currency: "IDR" | "DL",
    delta: number,
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id && item.currency === currency) {
          const nextQty = item.quantity + delta;
          if (nextQty > item.stock) {
            toast.error("Mencapai batas stok!");
            return item;
          }
          return { ...item, quantity: nextQty > 0 ? nextQty : 1 };
        }
        return item;
      }),
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalIdr = cart
    .filter((item) => item.currency === "IDR")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cartTotalDl = cart
    .filter((item) => item.currency === "DL")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotalIdr,
        cartTotalDl,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
