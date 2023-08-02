import { Model } from "objection";
import Item from "./Item";
import OrderGroup from "./OrderGroup";
import OrderAlteration from "./OrderAlteration";

export default class Order extends Model {
  id!: number;
  orderGroupId!: number;
  itemId!: number;
  units!: number;
  itemStatus!: "notready" | "ready";

  item?: Item;
  orderGroup?: OrderGroup;
  orderAlterations?: OrderAlteration[];

  static tableName = "Order";

  static relationMappings = () => ({
    orderGroup: {
      relation: Model.BelongsToOneRelation,
      modelClass: OrderGroup,
      join: {
        from: "Order.orderGroupId",
        to: "OrderGroup.id",
      },
    },
    item: {
      relation: Model.HasOneRelation,
      modelClass: Item,
      join: {
        from: "Order.itemId",
        to: "Item.id",
      },
    },
    orderAlterations: {
      relation: Model.HasManyRelation,
      modelClass: OrderAlteration,
      join: {
        from: "Order.id",
        to: "OrderAlteration.orderId",
      },
    },
  });
}
