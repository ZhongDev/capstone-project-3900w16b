import request from "./request";

type OrderStatus = "ordered" | "completed";

export type CreateOrderBody = {
  itemId: number;
  units: number;
  device: string;
}[];

export type CreateOrderResponse = {
  restaurantId: number;
  tableId: number;
  itemId: number;
  placedOn: string;
  status: OrderStatus;
  units: number;
  device: string;
  id: number;
}[];

export const createOrder = (
  restaurantId: number,
  tableId: number,
  orders: CreateOrderBody
) =>
  request
    .post(
      `${process.env.NEXT_PUBLIC_BASEURL}/order/${restaurantId}/${tableId}`,
      orders
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateOrderResponse>;

export type GetRestaurantOrdersByDeviceIdResponse = {
  id: number;
  tableId: number;
  item: {
    id: number;
    name: string;
    image: string | null;
    priceCents: number;
  };
  placedOn: string;
  status: OrderStatus;
  units: number;
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
