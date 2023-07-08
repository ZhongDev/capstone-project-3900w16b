import NotFound from "../errors/NotFound";
import * as menuRepo from "../repository/menu.repository";
import * as restaurantRepo from "../repository/restaurant.repository";
import { Item, UpdateCategory, UpdateItem } from "../types/menu";

// Calls functions from menu repository with restaurantId for authorisation

// Creates a menu catgeory
export const createCategory = async (restaurantId: number, name: string) => {
  return menuRepo.createCategory(restaurantId, name);
};

// Updates a menu category with a new name
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

// Delete a menu category
export const deleteCategory = async (
  restaurantId: number,
  categoryId: number
) => {
  const category = await menuRepo.getCategoryById(categoryId);
  if (category?.restaurantId !== restaurantId) {
    throw new NotFound("This category does not exist...");
  }
  return menuRepo.deleteCategory(categoryId);
};

// Create an item in a category
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

// Update an item in a category
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

// Delete item from a category
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

// Get menu
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
