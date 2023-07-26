import { Model } from "objection";
import Category from "./Category";
import Order from "./Order";

export default class Item extends Model {
  id!: number;
  categoryId!: number;
  displayOrder!: number;
  name!: string;
  image!: string;
  priceCents!: number;
  description!: string;
  ingredients!: string | null;
  minPrepMins?: number;
  maxPrepMins?: number;

  category?: Category;

  static tableName = "Item";

  static relationMappings = {
    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: Category,
      join: {
        from: "Item.categoryId",
        to: "Category.id",
      },
    },
    orders: {
      relation: Model.HasManyRelation,
      modelClass: Order,
      join: {
        from: "Item.id",
        to: "Order.itemId",
      },
    },
  };
}
