import { Model } from "objection";
import Category from "./Category";

export default class Item extends Model {
  id!: number;
  categoryId!: number;
  displayOrder!: number;
  name!: string;
  image!: string;
  priceCents!: number;
  description!: string;
  ingredients!: string | null;

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
  };
}
