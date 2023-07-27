import { Model, RelationMappings } from "objection";
import Category from "./Category";
import Order from "./Order";
import Alteration from "./Alteration";

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
  alterations?: Alteration[];

  static tableName = "Item";

  static relationMappings: RelationMappings = {
    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: Category,
      join: {
        from: "Item.categoryId",
        to: "Category.id",
      },
    },
    alterations: {
      relation: Model.HasManyRelation,
      modelClass: Alteration,
      join: {
        from: "Item.id",
        to: "Alteration.itemId",
      },
      modify: (builder) =>
        builder.select("id", "optionName", "maxChoices", "itemId"),
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
