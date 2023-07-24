export type Item = {
  itemId: number;
  restaurantId: number;
  units: number;
  device: string;
};

export type Cart = Record<number, Item[]>;
