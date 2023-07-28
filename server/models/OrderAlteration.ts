import { Model } from "objection";
import Alteration from "./Alteration";
import Order from "./Order";
import AlterationOption from "./AlterationOption";

export default class OrderAlteration extends Model {
  id!: number;
  orderId!: number;
  alterationId!: number;
  alterationOptionId!: number;

  order?: Order;
  alteration?: Alteration;
  alterationOptions?: AlterationOption[];

  static tableName = "OrderAlteration";

  static relationMappings = () => ({
    order: {
      relation: Model.BelongsToOneRelation,
      modelClass: Order,
      join: {
        from: "OrderAlteration.orderId",
        to: "Order.id",
      },
    },
    alteration: {
      relation: Model.BelongsToOneRelation,
      modelClass: Alteration,
      join: {
        from: "OrderAlteration.alterationId",
        to: "Alteration.id",
      },
    },
    alterationOptions: {
      relation: Model.BelongsToOneRelation,
      modelClass: AlterationOption,
      join: {
        from: "OrderAlteration.alterationOptionId",
        to: "AlterationOption.id",
      },
    },
  });
}
