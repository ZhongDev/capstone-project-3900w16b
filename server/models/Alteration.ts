import { Model, RelationMappingsThunk } from "objection";
import AlterationOption from "./AlterationOption";
import Item from "./Item";

export default class Alteration extends Model {
  id!: number;
  itemId!: number;
  optionName!: string;
  maxChoices!: number;

  item?: Item;
  options?: AlterationOption[];

  static tableName = "Alteration";

  static relationMappings: RelationMappingsThunk = () => ({
    options: {
      relation: Model.HasManyRelation,
      modelClass: AlterationOption,
      join: {
        from: "AlterationOption.alterationId",
        to: "Alteration.id",
      },
      modify: (builder) => builder.select("choice", "id", "alterationId"),
    },
    item: {
      relation: Model.BelongsToOneRelation,
      modelClass: Item,
      join: {
        from: "Item.id",
        to: "Alteration.itemId",
      },
    },
  });
}
