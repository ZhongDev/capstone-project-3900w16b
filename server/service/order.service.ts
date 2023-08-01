import { ForeignKeyViolationError } from "objection";
import * as orderRepo from "../repository/order.repository";
import * as restaurantRepo from "../repository/restaurant.repository";
import * as menuRepo from "../repository/menu.repository";
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

export const getOrderGroupById = async (orderGroupId: number) => {
  return orderRepo.getOrderGroupById(orderGroupId);
};

export const getOrdersByOrderGroupId = async (orderGroupId: number) => {
  return orderRepo.getOrdersByOrderGroupId(orderGroupId);
};

const logisticRegression = async (
  k: number,
  x: number,
  x0: number
): Promise<number> => {
  return 1 / (1 + Math.exp((-1 / (1 + Math.log(k))) * (x - x0 / 2)));
};
// Gets orders from 15 minutes ago to calculate ETA
export const getEstTimeByOrderGroupId = async (
  restaurantId: number,
  orderGroupId: number
) => {
  const ONE_HOUR = 60 * 60 * 1000;
  const orderGroup = await orderRepo.getOrderGroupById(orderGroupId);
  if (!orderGroup) {
    throw new NotFound("Invalid order");
  }
  const allOrders = await orderRepo.getRestaurantROrders(restaurantId);
  const recentOrders = allOrders.filter((order) => {
    const ordertime = new Date(order.placedOn);
    return Date.now() - ordertime.valueOf() <= ONE_HOUR;
  });
  const numTables = (await restaurantRepo.getRestaurantTables(restaurantId))
    .length;

  const busyConstant = await logisticRegression(
    numTables,
    recentOrders.length,
    numTables
  );

  let minSum = 0;
  let maxSum = 0;
  await Promise.all(
    orderGroup?.orders?.map((order) => {
      return menuRepo.getItemPrep(order.itemId).then((res) => {
        minSum += res.minPrepTime ? res.minPrepTime : 10;
        maxSum += res.maxPrepTime ? res.maxPrepTime : 25;
      });
    }) ?? []
  );
  let estTime =
    Math.round((minSum + busyConstant * (maxSum - minSum)) * 10) / 10;

  return estTime;
};
