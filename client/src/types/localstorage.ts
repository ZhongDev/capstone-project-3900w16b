export type InCartAlteration = {
  alterationId: number;
  selectedOptions: number[];
};

export type Item = {
  itemId: number;
  restaurantId: number;
  units: number;
  alterations?: InCartAlteration[];
};

export type Cart = Record<number, Item[]>;
