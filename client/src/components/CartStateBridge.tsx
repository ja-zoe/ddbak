// components/CartStateBridge.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

const CartContext = createContext<{
  cartCount: number;
  updateCart: () => void;
}>({
  cartCount: 0,
  updateCart: () => {},
});

export function CartStateBridge({
  cartSiblings,
}: {
  cartSiblings: React.ReactNode;
}) {
  const [cartCount, setCartCount] = useState(0);

  const updateCart = () => {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCart }}>
      {cartSiblings}
    </CartContext.Provider>
  );
}

export const useCartCount = () => useContext(CartContext);
