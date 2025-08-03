"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartProvider";

const CartIcon = () => {
  const cart = useCart();

  return (
    <a href="/shopping-cart">
      <div className="relative w-8 h-8">
        {cart.items.length > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full shadow-sm">
            {cart.items.length}
          </span>
        )}
        <ShoppingBag className="w-full h-full text-gold" />
      </div>
    </a>
  );
};

export default CartIcon;
