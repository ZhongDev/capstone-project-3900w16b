import { ForeignKeyViolationError } from "objection";
import * as orderRepo from "../repository/order.repository";
import * as menuRepo from "../repository/menu.repository";
import BadRequest from "../errors/BadRequest";

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
