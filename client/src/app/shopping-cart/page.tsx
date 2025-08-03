"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchProductFromId } from "@/lib/requests";
import type { Product } from "@payload";
import ImageComponent from "@/components/ImageComponent";
import { Minus, Plus, Trash2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/checkout";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useCart } from "@/contexts/CartProvider";
import type { CartItem } from "@/contexts/CartProvider";

type MergedCartItem = {
  product: Product;
  quantity: number;
  color?: {
    name: string;
    hex: string;
  };
  otherVariants?: Record<string, string>;
};

const Page = () => {
  const cart = useCart();
  const [mergedItems, setMergedItems] = useState<MergedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  useEffect(() => {
    async function mergeCartItems() {
      try {
        const { items } = cart;
        const merged = await Promise.all(
          items.map(async (item) => {
            const product = await fetchProductFromId(item.id);
            return {
              product,
              quantity: item.quantity,
              color: item.color,
              otherVariants: item.otherVariants,
            };
          })
        );
        setMergedItems(merged);
      } catch (error) {
        console.error("Failed to merge cart items:", error);
      } finally {
        setLoading(false);
      }
    }

    mergeCartItems();
  }, [cart]);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    cart.updateQuantity(item, newQuantity);
  };

  const handleRemove = (item: CartItem) => {
    cart.removeItem(item);
  };

  const getCartSubTotal = () => {
    return mergedItems.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );
  };

  async function handleCheckoutSubmit() {
    setIsCreatingCheckout(true);
    try {
      // Create mutable copy for checkout
      const checkoutItems = [...cart.items];
      const checkoutSession = await createCheckoutSession(checkoutItems);

      if (checkoutSession.url) {
        window.location.href = checkoutSession.url;
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to initiate checkout");
    } finally {
      setIsCreatingCheckout(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <AuroraBackground>
        <div className="relative h-screen flex justify-center items-center">
          <p>No items in shopping cart</p>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="bg-black/10 py-12 h-max">
      <div className="space-y-4 pt-20 relative min-h-screen">
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold mb-2">Shopping Cart</p>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Shop</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="md:flex md:flex-row md:justify-center md:gap-2">
          <div>
            {mergedItems.map((item, idx) => {
              const cartItem: CartItem = {
                id: item.product.id,
                quantity: item.quantity,
                color: item.color,
                otherVariants: item.otherVariants,
              };

              return (
                <div
                  key={`${item.product.id}-${idx}`}
                  className="flex gap-4 border-b py-4"
                >
                  <ImageComponent
                    data={item.product.pictures?.[0]}
                    className="w-28 h-28 rounded-sm overflow-hidden"
                  />
                  <div className="flex grow justify-between">
                    <div className="space-y-2">
                      <div>
                        <p className="text-lg font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          {item.product.description}
                        </p>
                      </div>
                      <div>
                        {item.color && (
                          <div className="flex items-center gap-2 text-sm">
                            <span>Color:</span>
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: item.color.hex }}
                            />
                            <span>{item.color.name}</span>
                          </div>
                        )}
                        {item.otherVariants &&
                          Object.entries(item.otherVariants).map(([k, v]) => (
                            <p key={k} className="text-sm">
                              {k}: {v}
                            </p>
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <p className="text-lg">${item.product.price}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                cartItem,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1 border rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(cartItem, item.quantity + 1)
                            }
                            className="p-1 border rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(cartItem)}
                          className="text-red-600 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="md:w-80 space-y-3 p-4">
            <p className="font-semibold">Order Summary</p>
            <div className="border-b">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${getCartSubTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>$0</p>
              </div>
            </div>
            <div className="flex justify-between">
              <p>Total</p>
              <p>USD ${getCartSubTotal().toFixed(2)}</p>
            </div>
            <button
              className="px-2 h-8 rounded-sm w-full text-white bg-gold cursor-pointer flex items-center justify-center"
              onClick={handleCheckoutSubmit}
              disabled={isCreatingCheckout}
            >
              {isCreatingCheckout ? <div className="loader" /> : "Checkout"}
            </button>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Page;
