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
    await Promise.all(
      orders.map(async (order) => {
        const item = await menuRepo.getItem(order.itemId);
        if (!item) {
          throw new BadRequest(`Item with ID ${order.itemId} does not exist.`);
        }
        order.alterations?.map((alteration) => {
          const selectedOptions = alteration.selectedOptions.length;
          const targetAlteration = item.alterations?.find(
            (itemAlteration) => itemAlteration.id === alteration.alterationId
          );
          if (!targetAlteration) {
            throw new BadRequest(
              `Alteration with ID ${alteration.alterationId} does not exist for item ID ${order.itemId}.`
            );
          }
          if (selectedOptions > targetAlteration.maxChoices) {
            throw new BadRequest(
              `Alteration with ID ${alteration.alterationId} has too many options (max ${targetAlteration.maxChoices}).`
            );
          }

          // Make sure sure all the options customer selected actually exists
          if (
            alteration.selectedOptions.find(
              (selectedOption) =>
                !targetAlteration.options?.find(
                  (option) => option.id === selectedOption
                )
            )
          ) {
            throw new BadRequest("Invalid options sent");
          }
        });
      })
    );
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
        const groupedAlterations = new Map<string, Set<string>>();
        for (const alteration of order.orderAlterations ?? []) {
          if (!alteration.alteration?.optionName) {
            continue;
          }

          let groupedAlteration = groupedAlterations.get(
            alteration.alteration.optionName
          );
          if (!groupedAlteration) {
            groupedAlteration = new Set();
            groupedAlterations.set(
              alteration.alteration.optionName,
              groupedAlteration
            );
          }
          if (alteration.alterationOption?.choice) {
            groupedAlteration.add(alteration.alterationOption.choice);
          }
        }

        return {
          id: order.id,
          item: {
            id: order.item?.id,
            name: order.item?.name,
            image: order.item?.image,
            priceCents: order.item?.priceCents,
          },
          units: order.units,
          alterations: [...groupedAlterations.entries()].map(
            ([alterationName, alterationOptions]) => ({
              alterationName,
              alterationOptions: [...alterationOptions],
            })
          ),
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
        const groupedAlterations = new Map<string, Set<string>>();
        for (const alteration of order.orderAlterations ?? []) {
          if (!alteration.alteration?.optionName) {
            continue;
          }

          let groupedAlteration = groupedAlterations.get(
            alteration.alteration.optionName
          );
          if (!groupedAlteration) {
            groupedAlteration = new Set();
            groupedAlterations.set(
              alteration.alteration.optionName,
              groupedAlteration
            );
          }
          if (alteration.alterationOption?.choice) {
            groupedAlteration.add(alteration.alterationOption.choice);
          }
        }

        return {
          id: order.id,
          item: {
            id: order.item?.id,
            name: order.item?.name,
          },
          units: order.units,
          itemStatus: order.itemStatus,
          alterations: [...groupedAlterations.entries()].map(
            ([alterationName, alterationOptions]) => ({
              alterationName,
              alterationOptions: [...alterationOptions],
            })
          ),
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

export const changeOrderItemToReady = async (orderItemId: number) => {
  const status = await orderRepo.changeOrderItemStatusToReady(orderItemId);
  return status;
};

export const getOrderTimeAgo = async (orderGroupId: number) => {
  const order = await orderRepo.getsOrderGroupById(orderGroupId);
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
  const allOrders = await orderRepo.getRestaurantUncompletedOrders(
    restaurantId
  );
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
  const estTime =
    Math.round((minSum + busyConstant * (maxSum - minSum)) * 10) / 10;

  return estTime;
};
