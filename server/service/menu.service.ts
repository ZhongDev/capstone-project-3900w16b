import NotFound from "../errors/NotFound";
import Alteration from "../models/Alteration";
import * as menuRepo from "../repository/menu.repository";
import * as restaurantRepo from "../repository/restaurant.repository";
import {
  Item,
  ItemAlteration,
  UpdateAlteration,
  UpdateCategory,
  UpdateItem,
} from "../types/menu";

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

export const createAlteration = async (
  restaurantId: number,
  itemId: number,
  alteration: ItemAlteration
) => {
  const restaurant = await menuRepo.getCategoryItemRestaurant(itemId);
  if (restaurant?.id !== restaurantId) {
    throw new NotFound("This item does not exist...");
  }
  return menuRepo.createAlteration(itemId, alteration);
};

export const updateAlteration = async (
  restaurantId: number,
  alterationId: number,
  updatedFields: UpdateAlteration
) => {
  const alterationRestaurant = await menuRepo.getAlterationRestaurant(
    alterationId
  );
  if (alterationRestaurant?.id !== restaurantId) {
    throw new NotFound("This item does not exist...");
  }
  return menuRepo.updateAlteration(alterationId, updatedFields);
};

export const deleteAlteration = async (
  restaurantId: number,
  alterationId: number
) => {
  const alterationRestaurant = await menuRepo.getAlterationRestaurant(
    alterationId
  );
  if (alterationRestaurant?.id !== restaurantId) {
    throw new NotFound("This item does not exist...");
  }
  return menuRepo.deleteAlteration(alterationId);
};

export const createAlterationOption = async (
  restaurantId: number,
  alterationId: number,
  choice: string
) => {
  const alterationRestaurant = await menuRepo.getAlterationRestaurant(
    alterationId
  );
  if (alterationRestaurant?.id !== restaurantId) {
    throw new NotFound("This item does not exist...");
  }
  const option = await menuRepo.createAlterationOption(alterationId, choice);
  return (await menuRepo.getAlteration(option.alterationId)) as Alteration;
};

export const updateAlterationOption = async (
  restaurantId: number,
  alterationOptionId: number,
  choice: string
) => {
  const alterationRestaurant = await menuRepo.getAlterationOptionRestaurant(
    alterationOptionId
  );

  if (alterationRestaurant?.id !== restaurantId) {
    throw new NotFound("This option does not exist...");
  }

  const [updatedAlterationOption] = await menuRepo.updateAlterationOption(
    alterationOptionId,
    choice
  );
  return (await menuRepo.getAlteration(
    updatedAlterationOption.alterationId
  )) as Alteration;
};

export const deleteAlterationOption = async (
  restaurantId: number,
  alterationOptionId: number
) => {
  const alterationOptionRestaurant =
    await menuRepo.getAlterationOptionRestaurant(alterationOptionId);
  if (alterationOptionRestaurant?.id !== restaurantId) {
    throw new NotFound("This option does not exist...");
  }
  return menuRepo.deleteAlterationOption(alterationOptionId);
};

// Get menu
export const getMenu = async (restaurantId: number) => {
  const restaurant = await restaurantRepo.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new NotFound("Restaurant does not exist.");
  }

  const restaurantData = { name: restaurant.name, id: restaurant.id };
  return {
    restaurant: restaurantData,
    menu: await menuRepo.getMenu(restaurantId),
  };
};

export const getMenuItem = async (itemId: number) => {
  const item = await menuRepo.getItem(itemId);
  if (!item) {
    throw new NotFound();
  }
  return item;
};

export const reorderCategories = async (
  restaurantId: number,
  newCategoryOrder: number[]
) => {
  await menuRepo.reorderCategories(restaurantId, newCategoryOrder);
  return getMenu(restaurantId);
};

export const reorderItems = async (
  restaurantId: number,
  categoryId: number,
  newItemsOrder: number[]
) => {
  // Make sure the restaurant owns this category
  const category = await menuRepo.getCategoryById(categoryId);
  if (category?.restaurantId !== restaurantId) {
    throw new NotFound("Category does not exist.");
  }

  await menuRepo.reorderItems(categoryId, newItemsOrder);
  return getMenu(restaurantId);
};
