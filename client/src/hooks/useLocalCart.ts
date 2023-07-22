import { Cart, Item } from "@/types/localstorage";
import { useState } from "react";
import { isUndefined } from "swr/_internal";

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
      setCart(localCart.filter((item) => item.itemId !== itemId));
    }
  };

  const removeOneFromCart = (itemId: number) => {
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

  const setUnitInCart = (itemId: number, units: number) => {
    const existingItemIndex = localCart.findIndex(
      (item) => item.itemId === itemId
    );

    if (!isUndefined(existingItemIndex)) {
      let cart = [
        ...localCart.slice(0, existingItemIndex),
        { ...localCart[existingItemIndex], units: units },
        ...localCart.slice(existingItemIndex + 1),
      ];
      setCart(cart);
    }
  };

  const clearCart = () => setCart([]);

  return [
    localCart,
    {
      addToCart,
      setUnitInCart,
      removeFromCart,
      removeOneFromCart,
      clearCart,
    },
  ] as const;
};
