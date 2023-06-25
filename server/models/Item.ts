import { Model } from "objection";

export default class Item extends Model {
  id!: number;
  categoryId!: number;
  displayOrder!: number;
  name!: string;
  image!: string;
  priceCents!: number;
  description!: string;
  ingredients!: string | null;

  static tableName = "Item";
}
