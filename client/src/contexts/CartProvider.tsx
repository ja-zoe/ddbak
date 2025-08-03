// context/CartProvider.tsx
"use client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
} from "react";

export type CartItem = {
  id: number;
  quantity: number;
  color?: {
    name: string;
    hex: string;
  };
  otherVariants?: Record<string, string>;
  // Add any other properties that make items unique
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { item: CartItem; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] };

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

// Deep comparison function for cart items
function areItemsEqual(item1: CartItem, item2: CartItem): boolean {
  // Compare IDs
  if (item1.id !== item2.id) return false;

  // Compare colors
  if (
    item1.color?.name !== item2.color?.name ||
    item1.color?.hex !== item2.color?.hex
  ) {
    return false;
  }

  // Compare other variants
  const variants1 = item1.otherVariants || {};
  const variants2 = item2.otherVariants || {};

  const variantKeys = new Set([
    ...Object.keys(variants1),
    ...Object.keys(variants2),
  ]);

  for (const key of variantKeys) {
    if (variants1[key] !== variants2[key]) {
      return false;
    }
  }

  return true;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find((item) =>
        areItemsEqual(item, action.payload)
      );
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            areItemsEqual(item, action.payload)
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        items: [...state.items, action.payload],
      };

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) => !areItemsEqual(item, action.payload)
        ),
      };

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            (item) => !areItemsEqual(item, action.payload.item)
          ),
        };
      }
      return {
        items: state.items.map((item) =>
          areItemsEqual(item, action.payload.item)
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        items: [],
      };

    case "SET_CART":
      return {
        items: action.payload,
      };

    default:
      return state;
  }
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          dispatch({
            type: "SET_CART",
            payload: Array.isArray(parsed) ? parsed : [],
          });
        } catch (e) {
          console.error("Failed to parse cart data", e);
        }
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const cartActions = useMemo(
    () => ({
      addItem: (item: CartItem) =>
        dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (item: CartItem) =>
        dispatch({ type: "REMOVE_ITEM", payload: item }),
      updateQuantity: (item: CartItem, quantity: number) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { item, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    }),
    []
  );

  const value = useMemo(
    () => ({
      items: state.items,
      ...cartActions,
    }),
    [state.items, cartActions]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
