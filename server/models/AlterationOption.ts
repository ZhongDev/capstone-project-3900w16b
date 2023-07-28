import { Model } from "objection";
import Alteration from "./Alteration";

export default class AlterationOption extends Model {
  id!: number;
  alterationId!: number;
  choice!: string;

  alteration?: Alteration;

  static tableName = "AlterationOption";

  static relationMappings = () => ({
    alteration: {
      relation: Model.BelongsToOneRelation,
      modelClass: Alteration,
      join: {
        from: "AlterationOption.alterationId",
        to: "Alteration.id",
      },
    },
  });
}
