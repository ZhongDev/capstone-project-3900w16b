import { Model } from "objection";

export default class Restaurant extends Model {
  id!: number;
  email!: string;
  name!: string;
  password!: string;

  static tableName = "Restaurant";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }
}
