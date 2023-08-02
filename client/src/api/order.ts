import request from "./request";

type OrderStatus = "ordered" | "prepared" | "completed";

export type CreateOrderBody = {
  itemId: number;
  units: number;
}[];

export type CreateOrderResponse = {
  itemId: number;
  orderGroupId: number;
  units: number;
  id: number;
}[];

export const createOrder = (
  restaurantId: number,
  tableId: number,
  device: string,
  orders: CreateOrderBody
) =>
  request
    .post(
      `${process.env.NEXT_PUBLIC_BASEURL}/order/${restaurantId}/${tableId}`,
      { items: orders, device }
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateOrderResponse>;

export type GetRestaurantOrdersByDeviceIdResponse = {
  orderGroupId: number;
  tableId: number;
  placedOn: string;
  status: OrderStatus;
  items: {
    id: number;
    item: {
      id: number;
      name: string;
      image: string | null;
      priceCents: number;
    };
    units: number;
    alterations: {
      alterationName: string;
      alterationOptions: string[];
    }[];
  }[];
}[];

export const getRestaurantOrdersByDeviceId = (
  restaurantId: number,
  deviceId: string
) =>
  request
    .get(`${process.env.NEXT_PUBLIC_BASEURL}/order/${restaurantId}/${deviceId}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetRestaurantOrdersByDeviceIdResponse>;

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

export const getEstTimeByOrderGroupId = (
  restaurantId: number,
  orderGroupId: number
) =>
  request
    .get(
      `${process.env.NEXT_PUBLIC_BASEURL}/order/${restaurantId}/est/${orderGroupId}`
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<number>;

export const getDaySummary = (
  restaurantId: number | undefined,
  from: string | undefined,
  to: string | undefined
) =>
  request
    .get(
      `${process.env.NEXT_PUBLIC_BASEURL}/order/${restaurantId}/summary/${from}/${to}`
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<RestaurantStats>;
