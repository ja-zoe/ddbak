export type CartItem = {
  productId: number;
  quantity: number;
  color?: {
    name: string;
    hex: string;
  };
  otherVariants?: Record<string, string>;
};

export class Cart {
  constructor(private cart: CartItem[] = []) {}

  // Immutable getters
  items(): Readonly<CartItem[]> {
    return [...this.cart];
  }

  count(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Mutation methods return NEW instances
  addItem(item: CartItem): Cart {
    const existingIndex = this.findItemIndex(item);
    const newItems = [...this.cart];

    if (existingIndex >= 0) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + item.quantity,
      };
    } else {
      newItems.push(item);
    }

    return new Cart(newItems);
  }

  removeItem(item: CartItem): Cart {
    return new Cart(this.cart.filter((i) => !this.itemsAreEqual(i, item)));
  }

  updateQuantity(item: CartItem, quantity: number): Cart {
    return new Cart(
      this.cart.map((i) =>
        this.itemsAreEqual(i, item) ? { ...i, quantity } : i
      )
    );
  }

  private findItemIndex(item: CartItem): number {
    return this.cart.findIndex((i) => this.itemsAreEqual(i, item));
  }

  private itemsAreEqual(a: CartItem, b: CartItem): boolean {
    // Compare product IDs (must match)
    if (a.productId !== b.productId) return false;

    // Compare color hex values (both undefined or equal)
    if (a.color?.hex !== b.color?.hex) return false;

    // Compare otherVariants
    return this.areVariantsEqual(a.otherVariants, b.otherVariants);
  }

  private areVariantsEqual(
    a?: Record<string, string>,
    b?: Record<string, string>
  ): boolean {
    // Both undefined
    if (!a && !b) return true;

    // One is undefined while the other exists
    if ((!a && b) || (a && !b)) return false;

    // Both exist - compare keys and values
    const aKeys = Object.keys(a!);
    const bKeys = Object.keys(b!);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every((key) => {
      return a![key] === b![key];
    });
  }
}
