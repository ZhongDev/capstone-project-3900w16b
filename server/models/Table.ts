import { Model } from "objection";
import Restaurant from "./Restaurant";
import Order from "./Order";

export default class Table extends Model {
  id!: number;
  restaurantId!: number;
  name!: string;
  restaurant?: Restaurant;

  static tableName = "Table";

  static relationMappings = () => ({
    restaurant: {
      relation: Model.BelongsToOneRelation,
      modelClass: Restaurant,
      join: {
        from: "Table.restaurantId",
        to: "Restaurant.id",
      },
    },
    orders: {
      relation: Model.HasManyRelation,
      modelClass: Order,
      join: {
        from: "Table.id",
        to: "Order.tableId",
      },
    },
  });
}
