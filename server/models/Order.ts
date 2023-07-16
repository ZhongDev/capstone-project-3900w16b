import { Model } from "objection";
import Table from "./Table";
import Restaurant from "./Restaurant";
import Item from "./Item";

export default class Order extends Model {
  id!: number;
  restaurantId!: number;
  tableId!: number;
  itemId!: number;
  units!: number;
  status!: "ordered" | "completed";
  device!: string | null; // free text to attempt to identify the device that ordered
  placedOn!: string; // This is a date string

  item?: Item;

  static tableName = "Order";

  static relationMappings = () => ({
    table: {
      relation: Model.BelongsToOneRelation,
      modelClass: Table,
      join: {
        from: "Order.tableId",
        to: "Table.id",
      },
    },
    restaurant: {
      relation: Model.BelongsToOneRelation,
      modelClass: Restaurant,
      join: {
        from: "Order.restaurantId",
        to: "Restaurant.id",
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
