import { Model } from "objection";

export default class Category extends Model {
  id!: number;
  restaurantId!: number;
  displayOrder!: number;
  name!: string;

  static tableName = "Category";
}
