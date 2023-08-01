import { ForeignKeyViolationError } from "objection";
import * as orderRepo from "../repository/order.repository";
import * as restaurantRepo from "../repository/restaurant.repository";
import * as menuRepo from "../repository/menu.repository";
import BadRequest from "../errors/BadRequest";
import NotFound from "../errors/NotFound";

import { OrderDay, RestaurantStats } from "../types/order";
import OrderGroup from "../models/OrderGroup";

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

export const getRestaurantOrders = async (
  restaurantId: number,
  from: string,
  to: string
) => {
  const orderDataByDay = [];
  for (let d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
    const orderDay = await orderRepo.getRestaurantOrders(
      restaurantId,
      d.toISOString(),
      d.toISOString()
    );
    orderDataByDay.push(orderDay);
  }

  const revenue: number[] = orderDataByDay.map((orderDay) => {
    const totalRevenueOrderDay = orderDay.reduce((acc, orderGroup) => {
      let totalRevenueOrderGroup = orderGroup.orders?.reduce((acc2, order) => {
        const cost = order.item?.priceCents
          ? (order.item?.priceCents / 100) * order.units
          : 0;
        return acc2 + cost;
      }, 0);
      totalRevenueOrderGroup = totalRevenueOrderGroup
        ? totalRevenueOrderGroup
        : 0;
      return acc + totalRevenueOrderGroup;
    }, 0);
    return totalRevenueOrderDay ? totalRevenueOrderDay : 0;
  });

  const totalRevenue = revenue.reduce((acc, day) => acc + day, 0);

  const numOrders: number[] = orderDataByDay.map((orderDay) => {
    return orderDay.reduce((acc, orderGroup) => {
      const orders = orderGroup.orders ? orderGroup.orders?.length : 0;
      return acc + orders;
    }, 0);
  });

  const totalOrders = numOrders.reduce((acc, day) => acc + day, 0);

  const ordersByDay: OrderDay = orderDataByDay.map((orderDay) => {
    return orderDay.map((orderGroup) => {
      return {
        orderGroupId: orderGroup.id,
        order: orderGroup.orders?.map((order) => {
          return {
            itemIds: order.item?.id,
            itemNames: order.item?.name,
            units: order.units,
          };
        }),
      };
    });
  });

  const itemDict = orderDataByDay.reduce((acc: any, orderDay) => {
    orderDay.forEach((orderGroup) => {
      orderGroup.orders?.forEach((order) => {
        const id = order.itemId;
        if (acc[id] == undefined) {
          acc[id] = 0;
        }
        acc[id] = acc[id] + order.units;
      });
    });
    return acc;
  }, {});
  const mostPopularItemId =
    Object.keys(itemDict).length !== 0
      ? Object.keys(itemDict).reduce((a, b) => {
          return itemDict[a] > itemDict[b] ? a : b;
        })
      : "";

  const mostPopularItem = await menuRepo.getItem(Number(mostPopularItemId));
  const mostPopularItemName = mostPopularItem?.name;

  const orderResponse: RestaurantStats = {
    fromDate: from,
    toDate: to,

    revenue: revenue,
    totalRevenue: totalRevenue,
    numOrders: numOrders,
    totalOrders: totalOrders,
    ordersByDay: ordersByDay,
    mostPopularItem: mostPopularItemName,
  };
  return orderResponse;
};
