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
import { useRouter } from "next/navigation";
import SkeletonCartItem from "@/components/skeletons/SkeletonCartItem";

type MergedCartItem = {
  product: Product;
  quantity: number;
  color?: {
    name: string;
    hex: string;
  };
  otherVariants?: Record<string, string>;
  isRemoving?: boolean; // New flag for removal state
};

const Page = () => {
  const cart = useCart();
  const [mergedItems, setMergedItems] = useState<MergedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [productCache, setProductCache] = useState<Record<number, Product>>({});
  const router = useRouter();

  useEffect(() => {
    async function mergeCartItems() {
      try {
        const { items } = cart;

        // Identify which products are not in cache
        const itemsToFetch = items.filter((item) => !productCache[item.id]);

        // Temporary cache copy to work with
        let updatedCache = { ...productCache };

        if (itemsToFetch.length > 0) {
          const fetchedProducts = await Promise.all(
            itemsToFetch.map((item) => fetchProductFromId(item.id))
          );

          const newCache = { ...updatedCache };
          fetchedProducts.forEach((product, index) => {
            const id = itemsToFetch[index].id;
            newCache[id] = product;
          });

          // Update the state cache with the new merged data
          setProductCache(newCache);
          updatedCache = newCache;
        }

        // Always use the updatedCache for merging
        const merged = items
          .map((item) => {
            const product = updatedCache[item.id];

            if (!product) {
              console.error(`Product not found for cart item ID: ${item.id}`);
              return null;
            }

            return {
              product,
              quantity: item.quantity,
              color: item.color,
              otherVariants: item.otherVariants,
            };
          })
          .filter(Boolean) as MergedCartItem[]; // remove nulls safely

        setMergedItems(merged);
      } catch (error) {
        console.error("Failed to merge cart items:", error);
      } finally {
        setLoading(false);
      }
    }

    mergeCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.items]);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    // Optimistic UI update first
    setMergedItems((prevItems) =>
      prevItems.map((mergedItem) => {
        if (areCartItemsEqual(mergedItem, item)) {
          return { ...mergedItem, quantity: newQuantity };
        }
        return mergedItem;
      })
    );

    // Then update the actual cart
    cart.updateQuantity(item, newQuantity);
  };

  const handleRemove = (item: CartItem) => {
    // Optimistic update - mark item as being removed immediately
    setMergedItems((prevItems) =>
      prevItems.map((mergedItem) => {
        if (
          mergedItem.product.id === item.id &&
          areCartItemsEqual(mergedItem, item)
        ) {
          return { ...mergedItem, isRemoving: true };
        }
        return mergedItem;
      })
    );

    // Then perform the actual removal
    cart.removeItem(item);
  };

  // Helper function to compare cart items
  const areCartItemsEqual = (
    mergedItem: MergedCartItem,
    cartItem: CartItem
  ) => {
    if (mergedItem.product.id !== cartItem.id) return false;

    // Compare colors
    if (
      mergedItem.color?.name !== cartItem.color?.name ||
      mergedItem.color?.hex !== cartItem.color?.hex
    ) {
      return false;
    }

    // Compare other variants
    const mergedVariants = mergedItem.otherVariants || {};
    const cartVariants = cartItem.otherVariants || {};

    const allKeys = new Set([
      ...Object.keys(mergedVariants),
      ...Object.keys(cartVariants),
    ]);

    for (const key of allKeys) {
      if (mergedVariants[key] !== cartVariants[key]) {
        return false;
      }
    }

    return true;
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
      const checkoutItems = [...cart.items];
      const checkoutSession = await createCheckoutSession(checkoutItems);

      if (checkoutSession.url) {
        router.push(checkoutSession.url);
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
      <AuroraBackground className="bg-black/10 py-12 min-h-screen">
        <div className="space-y-4 pt-20 relative">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-semibold mb-2">Shopping Cart</p>
          </div>
          <div className="md:flex md:flex-row md:justify-center md:gap-2 px-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCartItem key={i} />
              ))}
            </div>
            <div className="md:w-80 space-y-3 p-4 bg-gray-100 rounded-lg h-fit animate-pulse">
              <div className="w-32 h-6 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-full h-4 bg-gray-200 rounded" />
              </div>
              <div className="w-full h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </AuroraBackground>
    );
  }

  if (cart.items.length === 0) {
    return (
      <AuroraBackground className="bg-black/10 min-h-screen">
        <div className="relative h-screen flex justify-center items-center">
          <div className="text-center space-y-3">
            <p className="text-xl text-gray-600">No items in shopping cart</p>
            <Link href="/" className="inline-block px-6 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-all">
              Continue Shopping
            </Link>
          </div>
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
        <div className="space-y-4 md:flex md:justify-center md:gap-6 px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
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
                  className={`md:flex gap-4 border-b last:border-b-0 py-4 transition-opacity ${
                    item.isRemoving ? "opacity-50" : ""
                  }`}
                >
                  <ImageComponent
                    data={item.product.pictures?.[0]}
                    className="w-28 h-28 rounded-lg overflow-hidden shadow-md"
                  />
                  <div className="md:flex grow justify-between">
                    <div className="space-y-2">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.product.description}
                        </p>
                      </div>
                      <div>
                        {item.color && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-medium">Color:</span>
                            <div
                              className="w-5 h-5 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: item.color.hex }}
                            />
                            <span>{item.color.name}</span>
                          </div>
                        )}
                        {item.otherVariants &&
                          Object.entries(item.otherVariants).map(([k, v]) => (
                            <p key={k} className="text-sm text-gray-700">
                              <span className="font-medium">{k}:</span> {v}
                            </p>
                          ))}
                      </div>
                    </div>
                    <div className="flex md:flex-col justify-between items-end">
                      <p className="text-xl font-bold text-gold">${item.product.price}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                cartItem,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                            disabled={item.isRemoving}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(cartItem, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                            disabled={item.isRemoving}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(cartItem)}
                          className="text-red-600 text-xs flex items-center gap-1 hover:text-red-900 cursor-pointer transition-colors font-medium"
                          disabled={item.isRemoving}
                        >
                          {item.isRemoving ? (
                            <span>Removing...</span>
                          ) : (
                            <>
                              <Trash2 size={14} />
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="md:w-96 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 h-fit space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            <div className="border-b pb-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <p>Subtotal</p>
                <p className="font-semibold">${getCartSubTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-gray-700">
                <p>Shipping</p>
                <p className="font-semibold">$0.00</p>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <p>Total</p>
              <p className="text-gold">${getCartSubTotal().toFixed(2)} USD</p>
            </div>
            <button
              className="px-4 py-3 rounded-md w-full text-white bg-gold cursor-pointer flex items-center justify-center font-semibold hover:bg-gold/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCheckoutSubmit}
              disabled={isCreatingCheckout}
            >
              {isCreatingCheckout ? (
                <span className="flex items-center gap-2">
                  <div className="loader" />
                  Processing...
                </span>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Page;
