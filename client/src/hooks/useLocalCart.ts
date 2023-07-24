import { Cart, Item } from "@/types/localstorage";
import { useState } from "react";

export const useLocalCart = () => {
  const [localCart, setLocalCart] = useState<Cart>(
    JSON.parse(localStorage.getItem("cart") ?? "{}")
  );

  const setCart = (cart: Cart) => {
    setLocalCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addToCart = (newItem: Item) => {
    const restaurantId = newItem.restaurantId;
    let restCart = localCart[restaurantId];
    let newCart: Cart = {};

    const existingItem = restCart?.find(
      (item) => item.itemId === newItem.itemId
    );
    if (existingItem) {
      existingItem.units += newItem.units;
      newCart[restaurantId] = [...localCart[restaurantId]];
      setCart(newCart);
    } else {
      newCart[restaurantId] = restCart ? [...restCart, newItem] : [newItem];
      setCart(newCart);
    }
  };

  const removeFromCart = (itemId: number, restaurantId: number) => {
    const existingItem = localCart[restaurantId]?.find(
      (item) => item.itemId === itemId
    );
    if (existingItem) {
      let newCart: Cart = {};
      newCart[restaurantId] = localCart[restaurantId].filter(
        (item) => item.itemId !== itemId
      );
      setCart(newCart);
    }
  };

  const removeOneFromCart = (itemId: number, restaurantId: number) => {
    let newCart: Cart = {};
    const existingItem = localCart[restaurantId]?.find(
      (item) => item.itemId === itemId
    );
    if (existingItem) {
      if (existingItem.units === 1) {
        removeFromCart(itemId, restaurantId);
      } else {
        existingItem.units -= 1;
        newCart[restaurantId] = [...localCart[restaurantId]];
        setCart(newCart);
      }
    }
  };

  const setUnitInCart = (
    itemId: number,
    restaurantId: number,
    units: number
  ) => {
    const existingItemIndex = localCart[restaurantId]?.findIndex(
      (item) => item.itemId === itemId
    );

    if (existingItemIndex > -1) {
      let newCart: Cart = {};
      let items = [
        ...localCart[restaurantId].slice(0, existingItemIndex),
        { ...localCart[restaurantId][existingItemIndex], units: units },
        ...localCart[restaurantId].slice(existingItemIndex + 1),
      ];
      newCart[restaurantId] = items;
      setCart(newCart);
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
