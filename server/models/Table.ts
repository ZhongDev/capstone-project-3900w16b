import { Model } from "objection";
import Restaurant from "./Restaurant";

export default class Table extends Model {
  id!: number;
  restaurantId!: number;
  displayOrder!: number;
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
  });
}
