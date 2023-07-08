import NotFound from "../errors/NotFound";
import * as menuRepo from "../repository/menu.repository";
import * as restaurantRepo from "../repository/restaurant.repository";
import { Item, UpdateCategory, UpdateItem } from "../types/menu";

// Calls functions from menu repository

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

export const deleteCategory = async (
  restaurantId: number,
  categoryId: number
) => {
  const restaurant = await menuRepo.getCategoryById(categoryId);
  if (restaurant?.id !== restaurantId) {
    throw new NotFound("This item does not exist...");
  }
  return menuRepo.deleteCategory(categoryId);
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

export const deleteCategoryItem = async (
  restaurantId: number,
  itemId: number
) => {
  const restaurant = await menuRepo.getCategoryItemRestaurant(itemId);
  if (restaurant?.id !== restaurantId) {
    throw new NotFound("This item does not exist...");
  }
  return menuRepo.deleteCategoryItem(itemId);
};

export const getMenu = async (restaurantId: number) => {
  const restaurant = await restaurantRepo.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new NotFound("Restaurant does not exist.");
  }

  const restaurantData = { name: restaurant.name };
  return {
    restaurant: restaurantData,
    menu: await menuRepo.getMenu(restaurantId),
  };
};
