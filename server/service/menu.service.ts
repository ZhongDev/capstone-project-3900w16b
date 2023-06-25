import NotFound from "../errors/NotFound";
import * as menuRepo from "../repository/menu.repository";
import { Item, UpdateCategory, UpdateItem } from "../types/menu";

export const createCategory = async (restaurantId: number, name: string) => {
  return menuRepo.createCategory(restaurantId, name);
};

export const updateCategory = async (
  restaurantId: number,
  categoryId: number,
  updateFields: UpdateCategory
) => {
  const category = await menuRepo.getCategoryById(categoryId);
  if (category?.restaurantId !== restaurantId) {
    throw new NotFound("This category does not exist...");
  }
  return menuRepo.updateCategory(categoryId, updateFields);
};

export const createCategoryItem = async (
  restaurantId: number,
  categoryId: number,
  item: Item
) => {
  const category = await menuRepo.getCategoryById(categoryId);
  if (category?.restaurantId !== restaurantId) {
    throw new NotFound("This category does not exist...");
  }
  return menuRepo.createCategoryItem(categoryId, item);
};

export const updateCategoryItem = async (
  restaurantId: number,
  itemId: number,
  updateItem: UpdateItem
) => {
  const restaurant = await menuRepo.getCategoryItemRestaurant(itemId);
  if (restaurant?.id !== restaurantId) {
    throw new NotFound("This item does not exist...");
  }
  return menuRepo.updateCategoryItem(itemId, updateItem);
};

export const getMenu = async (restaurantId: number) => {
  return menuRepo.getMenu(restaurantId);
};
