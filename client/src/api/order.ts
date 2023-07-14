import request from "./request";

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
  status: "ordered" | "preparing" | "completed";
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
