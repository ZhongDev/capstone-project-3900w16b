export type Order = {
  id: number;
  itemId: number;
  itemName: string;
  units: number;
};

export type RestaurantStats = {
  fromDate: string;
  toDate: string;

  revenue: number[];
  totalRevenue: number;
  numOrders: number[];
  totalOrders: number;
  ordersByDay: Order[];
  mostPopularCategory: string;
  mostPopularItem: string;
};
