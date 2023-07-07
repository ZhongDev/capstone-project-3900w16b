import { ForeignKeyViolationError } from "objection";
import * as orderRepo from "../repository/order.repository";
import * as restaurantRepo from "../repository/restaurant.repository";
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
