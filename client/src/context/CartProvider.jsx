import { useCallback, useEffect, useMemo, useState } from "react";



import {
  STORAGE_KEY,
  normalizeProductForCart,
  restoreInitialCart,
} from "./CartUtils";

import { CartContext } from "./CartContext.js";

export function CartProvider({ children }) {


  const [cartItems, setCartItems] = useState(() => {
    return typeof window === "undefined" ? [] : restoreInitialCart();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    const normalized = normalizeProductForCart(product);
    const productId = normalized._id;
    if (!productId) return;

    const qty = Math.max(1, Number(quantity ?? 1));

    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [...prev, { productId, quantity: qty, product: normalized }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    if (!productId) return;
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const increaseQuantity = useCallback((productId) => {
    if (!productId) return;
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }, []);

  const decreaseQuantity = useCallback((productId) => {
    if (!productId) return;
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(0, i.quantity - 1) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item?.product?.price ?? 0);
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalPrice,
      totalItems,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalPrice,
      totalItems,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};




