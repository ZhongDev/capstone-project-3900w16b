import { Model } from "objection";

export default class Item extends Model {
  id!: number;
  categoryId!: number;
  displayOrder!: string;
  name!: string;
  image!: string;
  priceCents!: number;

  static tableName = "Item";
}
