import Order from "../models/Order";
import OrderGroup from "../models/OrderGroup";

export type CreateOrder = {
  itemId: number;
  units: number;
};

export const createOrder = (
  restaurantId: number,
  tableId: number,
  device: string | null,
  orders: CreateOrder[]
) => {
  return Order.transaction(async (trx) => {
    const orderGroup = await OrderGroup.query(trx).insert({
      restaurantId,
      tableId,
      device,
      placedOn: new Date().toISOString(),
    });

    return Promise.all(
      orders.map((order) => {
        return Order.query(trx).insert({
          itemId: order.itemId,
          orderGroupId: orderGroup.id,
          units: order.units,
        });
      })
    );
  });
};

export const getRestaurantOrdersByDeviceId = (
  restaurantId: number,
  deviceId: string
) => {
  return OrderGroup.query()
    .where({
      restaurantId,
      device: deviceId,
    })
    .withGraphFetched("orders.item");
};
