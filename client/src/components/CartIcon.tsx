"use client";

import { ShoppingBag } from "lucide-react";
import { getCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import { get } from "http";
import type { CartItem } from "@/lib/cart";

const CartIcon = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    const cart = getCart();
    setCart(cart);
  }, []);
  return (
    <a href="/shopping-cart">
      <div className="relative w-8 h-8">
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full shadow-sm">
            {cart.length}
          </span>
        )}
        <ShoppingBag className="w-full h-full text-gold" />
      </div>
    </a>
  );
};

export default CartIcon;
