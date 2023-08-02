import Order from "../models/Order";
import OrderAlteration from "../models/OrderAlteration";
import OrderGroup from "../models/OrderGroup";

export type CreateOrder = {
  itemId: number;
  units: number;
  itemStatus: "notready" | "ready";
  alterations?: {
    alterationId: number;
    selectedOptions: number[];
  }[];
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
      orders.map(async (order) => {
        const createdOrder = await Order.query(trx).insert({
          itemId: order.itemId,
          orderGroupId: orderGroup.id,
          units: order.units,
          itemStatus: order.itemStatus,
        });
        if (order.alterations) {
          await Promise.all(
            order.alterations?.flatMap((alteration) => {
              return alteration.selectedOptions.map((selectedOptionId) => {
                return OrderAlteration.query(trx).insert({
                  orderId: createdOrder.id,
                  alterationId: alteration.alterationId,
                  alterationOptionId: selectedOptionId,
                });
              });
            })
          );
        }
        return createdOrder;
      })
    );
  });
};

export const getOrderGroupById = async (orderGroupId: number) => {
  return OrderGroup.query()
    .findOne({
      id: orderGroupId,
    })
    .withGraphFetched("[orders, table]");
};

export const updateOrderGroupById = async (
  orderGroupId: number,
  update: {
    status?: "ordered" | "prepared" | "completed";
    paid?: boolean;
  }
) => {
  return OrderGroup.query().patch(update).where({ id: orderGroupId });
};

export const getOrdersByOrderGroupId = (orderGroupId: number) => {
  return Order.query()
    .where({
      orderGroupId,
    })
    .then((a) => {
      return a;
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
    .orderBy("placedOn", "desc")
    .withGraphFetched(
      "[table, orders.[item, orderAlterations.[alteration, alterationOption]]]"
    );
};

export const getRestaurantOrderGroups = (restaurantId: number) => {
  return OrderGroup.query()
    .where({
      restaurantId,
    })
    .withGraphFetched(
      "[table, orders.[item, orderAlterations.[alteration, alterationOption]]]"
    );
};

export const changeOrderStatusToComplete = async (orderGroupId: number) => {
  await OrderGroup.query()
    .patch({ status: "completed" })
    .where({ id: orderGroupId });
  return OrderGroup.query()
    .findOne({ id: orderGroupId })
    .withGraphFetched("table");
};

export const changeOrderStatusToOrdered = async (orderGroupId: number) => {
  await OrderGroup.query()
    .patch({ status: "ordered" })
    .where({ id: orderGroupId });
  return OrderGroup.query()
    .findOne({ id: orderGroupId })
    .withGraphFetched("table");
};

export const changeOrderStatusToPrepared = async (orderGroupId: number) => {
  await OrderGroup.query()
    .patch({ status: "prepared" })
    .where({ id: orderGroupId });
  return OrderGroup.query()
    .findOne({ id: orderGroupId })
    .withGraphFetched("table");
};

export const changeOrderItemStatusToReady = async (orderItemId: number) => {
  await Order.query().patch({ itemStatus: "ready" }).where({ id: orderItemId });
  return Order.query().findOne({ id: orderItemId });
};

export const getsOrderGroupById = (orderGroupId: number) => {
  return OrderGroup.query().findOne({
    id: orderGroupId,
  });
};

export const getRestaurantUncompletedOrders = (restaurantId: number) => {
  return OrderGroup.query()
    .where({ restaurantId })
    .where({ status: "ordered" })
    .withGraphFetched("[orders, table]");
};
