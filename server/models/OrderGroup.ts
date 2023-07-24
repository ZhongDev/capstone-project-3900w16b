import { Model } from "objection";
import Table from "./Table";
import Restaurant from "./Restaurant";
import Item from "./Item";
import Order from "./Order";

export default class OrderGroup extends Model {
  id!: number;
  restaurantId!: number;
  tableId!: number;
  status!: "ordered" | "completed";
  device!: string | null; // free text to attempt to identify the device that ordered
  placedOn!: string; // This is a date string

  table?: Table;
  restaurant?: Restaurant;
  orders?: Order[];

  static tableName = "OrderGroup";

  static relationMappings = () => ({
    table: {
      relation: Model.BelongsToOneRelation,
      modelClass: Table,
      join: {
        from: "Order.tableId",
        to: "Table.id",
      },
    },
    orders: {
      relation: Model.HasManyRelation,
      modelClass: Order,
      join: {
        from: "OrderGroup.id",
        to: "Order.orderGroupId",
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
  });
}
