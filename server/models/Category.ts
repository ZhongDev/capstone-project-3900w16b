import { Model } from "objection";
import Item from "./Item";

export default class Category extends Model {
  id!: number;
  restaurantId!: number;
  displayOrder!: number;
  name!: string;

  static tableName = "Category";

  static relationMappings = {
    items: {
      relation: Model.HasManyRelation,
      modelClass: Item,
      join: {
        from: "Category.id",
        to: "Item.categoryId",
      },
    },
  };
}
