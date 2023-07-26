export type Item = {
  itemId: number;
  restaurantId: number;
  units: number;
};

export type Cart = Record<number, Item[]>;
