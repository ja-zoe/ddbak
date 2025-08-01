export type CartItem = {
  productId: string;
  quantity: number;
  color?: {
    name: string;
    hex: string;
  };
  otherVariants?: Record<string, string>;
};

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(
  productId: string,
  quantity = 1,
  color?: { name: string; hex: string },
  otherVariants?: Record<string, string>
) {
  const cart = getCart();

  const match = (item: CartItem) =>
    item.productId === productId &&
    item.color?.name === color?.name &&
    item.color?.hex === color?.hex &&
    JSON.stringify(item.otherVariants) === JSON.stringify(otherVariants);

  const idx = cart.findIndex(match);

  if (idx !== -1) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({ productId, quantity, color, otherVariants });
  }

  saveCart(cart);
}

export function removeFromCart(productId: string) {
  const cart = getCart();
  saveCart(cart.filter((item) => item.productId !== productId));
}

export function setQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const idx = cart.findIndex((item) => item.productId === productId);
  if (idx !== -1) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      cart[idx].quantity = quantity;
      saveCart(cart);
    }
  }
}
