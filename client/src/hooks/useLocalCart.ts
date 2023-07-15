import { Cart, Item } from "@/types/localstorage";
import { useState } from "react";

export const useLocalCart = () => {
  const [localCart, setLocalCart] = useState<Cart>(
    JSON.parse(localStorage.getItem("cart") ?? "[]")
  );

  const setCart = (cart: Cart) => {
    setLocalCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addToCart = (newItem: Item) => {
    const existingItem = localCart.find(
      (item) => item.itemId === newItem.itemId
    );
    if (existingItem) {
      existingItem.units += newItem.units;
      setCart([...localCart]);
    } else {
      setCart([...localCart, newItem]);
    }
  };

  const removeFromCart = (itemId: number) => {
    const existingItem = localCart.find((item) => item.itemId === itemId);
    if (existingItem) {
      if (existingItem.units === 1) {
        setCart(localCart.filter((item) => item.itemId !== itemId));
      } else {
        existingItem.units -= 1;
        setCart([...localCart]);
      }
    }
  };

  const clearCart = () => setCart([]);

  return [localCart, { addToCart, removeFromCart, clearCart }] as const;
};
