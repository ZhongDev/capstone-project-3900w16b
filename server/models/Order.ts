import { Model } from "objection";
import Item from "./Item";
import OrderGroup from "./OrderGroup";

export default class Order extends Model {
  id!: number;
  orderGroupId!: number;
  itemId!: number;
  units!: number;

  item?: Item;
  orderGroup?: OrderGroup;

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
  });
}
