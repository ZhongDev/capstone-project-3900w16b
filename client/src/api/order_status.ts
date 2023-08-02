import request from "./request";

type OrderStatus = "ordered" | "prepared" | "completed";

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
    alterations: {
      alterationName: string;
      alterationOptions: string[];
    }[];
  }[];
}[];

export type GetTimeAgoResponse = {
  orderGroupId: number;
  placedOn: string;
  hour: string;
  minute: string;
};

export const getOrderTimeById = (orderGroupId: number) => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/order/timeAgo/" + orderGroupId)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetTimeAgoResponse>;
};

export const getOrders = () => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/order/orders")
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetOrdersResponse>;
};

export const orderStatusToComplete = (orderGroupId: number) => {
  return request
    .post(
      `${process.env.NEXT_PUBLIC_BASEURL}/order/statusComplete/${orderGroupId}`
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetOrdersResponse>;
};

export const orderStatusToOrdered = (orderGroupId: number) => {
  return request
    .post(
      `${process.env.NEXT_PUBLIC_BASEURL}/order/statusOrdered/${orderGroupId}`
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetOrdersResponse>;
};

export const orderStatusToPrepared = (orderGroupId: number) => {
  return request
    .post(
      `${process.env.NEXT_PUBLIC_BASEURL}/order/statusPrepared/${orderGroupId}`
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetOrdersResponse>;
};
