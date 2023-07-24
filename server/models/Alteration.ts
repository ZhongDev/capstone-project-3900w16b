import { Model } from "objection";
import Item from "./Item";

export default class Alteration extends Model {
  id!: number;
  itemId!: number;
  optionName!: string;
  maxChoices!: number;

  item?: Item;

  static tableName = "Alteration";

  static relationMappings = () => ({
    item: {
      relation: Model.HasOneRelation,
      modelClass: Item,
      join: {
        from: "Order.itemId",
        to: "Alteration.id",
      },
    },
  });
}
