import { Model } from "objection";
import Table from "./Table";
import Order from "./Order";

export default class Restaurant extends Model {
  id!: number;
  email!: string;
  name!: string;
  password!: string;

  numTables!: number;
  tables?: Table[];

  static tableName = "Restaurant";

  static relationMappings = () => ({
    tables: {
      relation: Model.HasManyRelation,
      modelClass: Table,
      join: {
        from: "Table.id",
        to: "Table.restaurantId",
      },
    },
    orders: {
      relation: Model.HasManyRelation,
      modelClass: Order,
      join: {
        from: "Restaurant.id",
        to: "Order.restaurantId",
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }
}
