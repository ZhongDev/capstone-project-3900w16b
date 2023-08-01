import { ForeignKeyViolationError } from "objection";
import * as orderRepo from "../repository/order.repository";
import BadRequest from "../errors/BadRequest";
import NotFound from "../errors/NotFound";

export const createOrder = async (
  restaurantId: number,
  tableId: number,
  device: string | null,
  orders: orderRepo.CreateOrder[]
) => {
  try {
    return await orderRepo.createOrder(restaurantId, tableId, device, orders);
  } catch (err) {
    if (err instanceof ForeignKeyViolationError) {
      throw new BadRequest(
        "Bad request, please make sure the restaurant/item/table is valid."
      );
    }
    throw err;
  }
};

export const getRestaurantOrdersByDeviceId = async (
  restaurantId: number,
  deviceId: string
) => {
  const orderGroups = await orderRepo.getRestaurantOrdersByDeviceId(
    restaurantId,
    deviceId
  );
  return orderGroups.map((group) => {
    return {
      orderGroupId: group.id,
      tableId: group.tableId,
      placedOn: group.placedOn,
      status: group.status,
      items: group.orders?.map((order) => {
        return {
          id: order.id,
          item: {
            id: order.item?.id,
            name: order.item?.name,
            image: order.item?.image,
            priceCents: order.item?.priceCents,
          },
          units: order.units,
        };
      }),
    };
  });
};

export const getOrdersByRestaurantId = async (restaurantId: number) => {
  const orderGroups = await orderRepo.getRestaurantOrderGroups(restaurantId);
  return orderGroups.map((group) => {
    return {
      orderGroupId: group.id,
      tableId: group.tableId,
      placedOn: group.placedOn,
      status: group.status,
      items: group.orders?.map((order) => {
        return {
          id: order.id,
          item: {
            id: order.item?.id,
            name: order.item?.name,
          },
          units: order.units,
        };
      }),
    };
  });
};

export const changeOrderToComplete = async (orderGroupId: number) => {
  const status = await orderRepo.changeOrderStatusToComplete(orderGroupId);
  return status;
};

export const changeOrderToOrdered = async (orderGroupId: number) => {
  const status = await orderRepo.changeOrderStatusToOrdered(orderGroupId);
  return status;
};

export const changeOrderToPrepared = async (orderGroupId: number) => {
  const status = await orderRepo.changeOrderStatusToPrepared(orderGroupId);
  return status;
};

export const getOrderTimeAgo = async (orderGroupId: number) => {
  const order = await orderRepo.getOrderGroupById(orderGroupId);
  if (!order) {
    throw new NotFound("Order does not exist.");
  }
  const time = new Date(order?.placedOn);
  const dateNow = new Date();
  const diff = Math.floor((dateNow.getTime() - time.getTime()) / (1000 * 60));
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return {
    orderGroupId: orderGroupId,
    placedOn: order.placedOn,
    hour: hours.toString(),
    minute: minutes.toString(),
  };
};
