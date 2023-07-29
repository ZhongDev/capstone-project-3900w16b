import request from "./request";

type OrderStatus = "ordered" | "completed";

export type GetOrdersResponse = {
  orderGroupId: number;
  tableId: number;
  placedOn: string;
  status: OrderStatus;
  items: {
    id: number;
    item: {
      id: number;
      name: string;
    };
    units: number;
  }[];
}[];

export const getOrders = () => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/order/orders")
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetOrdersResponse>;
};

export const changeOrderStatus = (orderGroupId: number) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/order/orderStatus", {
      orderGroupId,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetOrdersResponse>;
};
