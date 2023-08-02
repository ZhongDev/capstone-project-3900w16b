export type Order = {
  itemIds: number | undefined;
  itemNames: string | undefined;
  units: number;
};

export type OrderDay = {
  orderGroupId: number;
  order: Order[] | undefined;
}[][];

export type RestaurantStats = {
  fromDate: string;
  toDate: string;

  revenue: number[];
  totalRevenue: number;
  numOrders: number[];
  totalOrders: number;
  ordersByDay: OrderDay;
  mostPopularItem: string | undefined;
};
