import { Cart, InCartAlteration, Item } from "@/types/localstorage";
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

const isEqualAlterations = (
  alterations1: InCartAlteration[],
  alterations2: InCartAlteration[]
) => {
  if (alterations1.length !== alterations2.length) {
    return false;
  }

  const alterations1Id = alterations1
    .map((alteration) => alteration.alterationId)
    .sort((a, b) => a - b);

  const alterations2Id = alterations2
    .map((alteration) => alteration.alterationId)
    .sort((a, b) => a - b);

  const isAlterationIdsEqual = sortedArrayIsEqual(
    alterations1Id,
    alterations2Id
  );
  if (!isAlterationIdsEqual) {
    return false;
  }

  for (let i = 0; i < alterations1Id.length; i++) {
    const alterations1SelectedOptions = [
      ...alterations1[i].selectedOptions,
    ].sort((a, b) => a - b);

    const alterations2SelectedOptions = [
      ...alterations2[i].selectedOptions,
    ].sort((a, b) => a - b);

    const hasSameOptions = sortedArrayIsEqual(
      alterations1SelectedOptions,
      alterations2SelectedOptions
    );

    if (!hasSameOptions) {
      return false;
    }
  }

  return true;
};

const sortedArrayIsEqual = (array1: any[], array2: any[]) => {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};
