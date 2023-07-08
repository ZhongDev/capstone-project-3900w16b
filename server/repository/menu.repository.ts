import { raw } from "objection";
import Item from "../models/Item";
import Category from "../models/Category";
import { Item as ItemType, UpdateCategory, UpdateItem } from "../types/menu";

export const createCategory = async (restaurantId: number, name: string) => {
  const newCategory = await Category.query().insert({
    displayOrder: raw(
      "COALESCE(?, 0) + 1",
      Category.query().max("displayOrder").where({
        restaurantId,
      })
    ),
    name,
    restaurantId,
  });
  return Category.query().findOne({ id: newCategory.id });
};

export const updateCategory = async (
  categoryId: number,
  updateFields: UpdateCategory
) => {
  await Category.query()
    .patch({
      name: updateFields.name,
      displayOrder: updateFields.displayOrder,
    })
    .where({ id: categoryId });

  return Category.query().findOne({ id: categoryId });
};

export const getCategories = (restaurantId: number) => {
  return Category.query()
    .where({
      restaurantId,
    })
    .orderBy("category.displayOrder");
};

export const getCategoryById = (categoryId: number) => {
  return Category.query().findOne({
    id: categoryId,
  });
};

export const createCategoryItem = async (
  categoryId: number,
  item: ItemType
) => {
  const newItem = await Item.query().insert({
    categoryId,
    displayOrder: raw(
      "COALESCE(?, 0) + 1",
      Item.query().max("displayOrder").where({ categoryId })
    ),
    name: item.name,
    priceCents: item.priceCents,
    description: item.description,
    ingredients: item.ingredients,
  });
  return Item.query().findOne({ id: newItem.id });
};

export const getItem = async (itemId: number) => {
  return Item.query().findById(itemId);
};

export const getCategoryItemRestaurant = async (id: number) => {
  const item = await Item.query()
    .findById(id)
    .withGraphFetched("category.restaurant");
  return item?.category?.restaurant;
};

export const updateCategoryItem = async (
  id: number,
  updateItem: UpdateItem
) => {
  await Item.query()
    .patch({
      name: updateItem.name,
      displayOrder: updateItem.displayOrder,
      description: updateItem.description,
      ingredients: updateItem.ingredients,
      priceCents: updateItem.priceCents,
    })
    .where({ id });
  return Item.query().findOne({ id });
};

export const deleteCategoryItem = async (id: number) => {
  return Item.query().where("id", id).del();
};

export const getMenu = (restaurantId: number) => {
  return Category.query()
    .where({ restaurantId })
    .withGraphJoined("items")
    .orderBy("category.displayOrder")
    .orderBy("items.displayOrder");
};
