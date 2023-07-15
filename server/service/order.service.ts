import { ForeignKeyViolationError } from "objection";
import * as orderRepo from "../repository/order.repository";
import BadRequest from "../errors/BadRequest";

export const createOrder = async (
  restaurantId: number,
  tableId: number,
  orders: orderRepo.CreateOrder[]
) => {
  try {
    return await orderRepo.createOrder(restaurantId, tableId, orders);
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
  const orders = await orderRepo.getRestaurantOrdersByDeviceId(
    restaurantId,
    deviceId
  );

  return orders.map((order) => {
    return {
      id: order.id,
      tableId: order.tableId,
      item: {
        id: order.item?.id,
        name: order.item?.name,
        image: order.item?.image,
        priceCents: order.item?.priceCents,
      },
      placedOn: order.placedOn,
      status: order.status,
      units: order.units,
    };
  });
};
