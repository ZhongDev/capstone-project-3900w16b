import Item from "../models/Item";
import Category from "../models/Category";
import { Item as ItemType } from "../types/menu";

export const createCategory = (
  restaurantId: number,
  name: string,
  displayOrder: number
) => {
  return Category.query().insert({
    displayOrder,
    name,
    restaurantId,
  });
};

export const getCategoryById = (categoryId: number) => {
  return Category.query().findOne({
    id: categoryId,
  });
};

export const createCategoryItem = (
  categoryId: number,
  displayOrder: number,
  item: ItemType
) => {
  return Item.query().insert({
    categoryId,
    displayOrder,
    name: item.name,
    priceCents: item.priceCents,
  });
};

export const getMenu = (restaurantId: number) => {
  return Category.query()
    .where({ restaurantId })
    .withGraphJoined("items")
    .orderBy("category.displayOrder")
    .orderBy("items.displayOrder");
};
