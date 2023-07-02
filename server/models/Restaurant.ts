import { Model } from "objection";
import Table from "./Table";

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
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $formatJson(json: any) {
        json = super.$formatJson(json);
        delete json.password;
        return json;
    }
}
