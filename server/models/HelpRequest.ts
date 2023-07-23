import { Model } from "objection";
import Table from "./Table";
import Restaurant from "./Restaurant";

export default class HelpRequest extends Model {
  id!: number;
  restaurantId!: number;
  tableId!: number;
  status!: "resolved" | "unresolved";
  device!: string | null; // free text to attempt to identify the device that ordered
  placedOn!: string; // This is a date string

  static tableName = "Order";

  static relationMappings = () => ({
    table: {
      relation: Model.BelongsToOneRelation,
      modelClass: Table,
      join: {
        from: "Request.tableId",
        to: "Table.id",
      },
    },
    restaurant: {
      relation: Model.BelongsToOneRelation,
      modelClass: Restaurant,
      join: {
        from: "Request.restaurantId",
        to: "Restaurant.id",
      },
    },
  });
}
