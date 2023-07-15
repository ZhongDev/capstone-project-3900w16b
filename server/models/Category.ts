import { Model, QueryBuilder } from "objection";
import Item from "./Item";
import Restaurant from "./Restaurant";

export default class Category extends Model {
  id!: number;
  restaurantId!: number;
  displayOrder!: number;
  name!: string;

  items?: Item[];
  restaurant?: Restaurant;

  static tableName = "Category";

  static relationMappings = () => ({
    items: {
      relation: Model.HasManyRelation,
      modelClass: Item,
      join: {
        from: "Category.id",
        to: "Item.categoryId",
      },
    },
    restaurant: {
      relation: Model.BelongsToOneRelation,
      modelClass: Restaurant,
      join: {
        from: "Category.restaurantId",
        to: "Restaurant.id",
      },
    },
  });
}
