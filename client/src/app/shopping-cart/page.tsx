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
import { getCart, setQuantity, removeFromCart } from "../../lib/cart";
import { fetchProductFromId } from "@/lib/requests";
import type { Product } from "@payload";
import ImageComponent from "@/components/ImageComponent";
import { Minus, Plus, Trash2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/checkout";
import { AuroraBackground } from "@/components/ui/aurora-background";

type RawCartItem = {
  productId: string;
  quantity: number;
  color?: {
    name: string;
    hex: string;
  };
  otherVariants?: Record<string, string>;
};

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
  const [cartItems, setCartItems] = useState<MergedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const rawCart: RawCartItem[] = getCart();
      const itemsWithProducts: MergedCartItem[] = await Promise.all(
        rawCart.map(async (item) => {
          const product = await fetchProductFromId(parseInt(item.productId));
          return {
            product,
            quantity: item.quantity,
            color: item.color,
            otherVariants: item.otherVariants,
          };
        })
      );
      setCartItems(itemsWithProducts);
      setLoading(false);
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (productId: string, newQty: number) => {
    setQuantity(productId, newQty);
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id.toString() === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setCartItems((prev) =>
      prev.filter((item) => item.product.id.toString() !== productId)
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>No items in shopping cart</p>
      </div>
    );
  }

  function getCartSubTotal() {
    return cartItems
      .map((item) => item.product.price * item.quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  async function handleCheckoutSubmit() {
    setIsCreatingCheckout(true);
    try {
      const checkoutSession = await createCheckoutSession(getCart());
      if (checkoutSession.url) {
        window.location.href = checkoutSession.url;
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setIsCreatingCheckout(false);
  }

  return (
    <AuroraBackground className="bg-black/10 py-12">
      <div className="space-y-4 p-4">
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
            {cartItems.map((item, idx) => {
              console.log(item);
              return (
                <div
                  key={`${item.product.name}-${idx}`}
                  className="flex gap-4 border-b py-4 "
                >
                  {/* Image */}
                  <ImageComponent
                    data={item.product.pictures?.[0]}
                    className="w-28 h-28 rounded-sm overflow-hidden"
                  />
                  <div className="flex grow justify-between">
                    {/* Product Info */}
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
                    {/* Quantity Controls & Remove */}
                    <div className="flex flex-col justify-between items-end">
                      <p className="text-lg">${item.product.price}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id.toString(),
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
                              handleQuantityChange(
                                item.product.id.toString(),
                                item.quantity + 1
                              )
                            }
                            className="p-1 border rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            handleRemove(item.product.id.toString())
                          }
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
                <p>${getCartSubTotal()}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>$0</p>
              </div>
            </div>
            <div className="flex justify-between">
              <p>Total</p>
              <p>USD ${getCartSubTotal()}</p>
            </div>
            <button
              className="px-2 h-8 rounded-sm w-full text-white bg-gold cursor-pointer flex items-center justify-center"
              onClick={() => handleCheckoutSubmit()}
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
