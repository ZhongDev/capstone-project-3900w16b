import Order from "../models/Order";

export type CreateOrder = {
  status: "ordered" | "preparing" | "completed";
  itemId: number;
  placedOn: string;
  units: number;
  device: string | null;
};

export const createOrder = (
  restaurantId: number,
  tableId: number,
  orders: CreateOrder[]
) => {
  return Order.transaction(async (trx) => {
    return Promise.all(
      orders.map((order) => {
        return Order.query(trx).insert({
          restaurantId,
          tableId,
          itemId: order.itemId,
          placedOn: order.placedOn,
          status: order.status,
          units: order.units,
          device: order.device,
        });
      })
    );
  });
};
