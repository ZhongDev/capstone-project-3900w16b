import { Model } from "objection";
import Table from "./Table";
import Restaurant from "./Restaurant";

export type HelpCallStatus = "resolved" | "unresolved";

export default class HelpCall extends Model {
  id!: number;
  restaurantId!: number;
  tableId!: number;
  status!: HelpCallStatus;
  placedOn!: string; // This is a date string

  static tableName = "Help";

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
