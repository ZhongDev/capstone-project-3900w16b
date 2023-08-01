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

export const getRestaurantOrderGroups = (restaurantId: number) => {
  return OrderGroup.query()
    .where({
      restaurantId,
    })
    .withGraphFetched("orders.item");
};

export const changeOrderStatusToComplete = async (orderGroupId: number) => {
  await OrderGroup.query()
    .patch({ status: "completed" })
    .where({ id: orderGroupId });
  return OrderGroup.query().findOne({ id: orderGroupId });
};

export const changeOrderStatusToOrdered = async (orderGroupId: number) => {
  await OrderGroup.query()
    .patch({ status: "ordered" })
    .where({ id: orderGroupId });
  return OrderGroup.query().findOne({ id: orderGroupId });
};

export const changeOrderStatusToPrepared = async (orderGroupId: number) => {
  await OrderGroup.query()
    .patch({ status: "prepared" })
    .where({ id: orderGroupId });
  return OrderGroup.query().findOne({ id: orderGroupId });
};

export const getOrderGroupById = (orderGroupId: number) => {
  return OrderGroup.query().findOne({
    id: orderGroupId,
  });
};
