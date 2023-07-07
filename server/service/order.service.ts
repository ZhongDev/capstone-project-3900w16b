import { ForeignKeyViolationError } from "objection";
import * as orderRepo from "../repository/order.repository";
import * as restaurantRepo from "../repository/restaurant.repository";
import BadRequest from "../errors/BadRequest";

export const createOrder = async (
  restaurantId: number,
  tableId: number,
  order: orderRepo.CreateOrder
) => {
  try {
    return await orderRepo.createOrder(restaurantId, tableId, order);
  } catch (err) {
    if (err instanceof ForeignKeyViolationError) {
      throw new BadRequest("Bad request, are you sure the table exists?");
    }
    throw err;
  }
};
