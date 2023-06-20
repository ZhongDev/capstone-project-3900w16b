import NotFound from "../errors/NotFound";
import * as menuRepo from "../repository/menu.repository";
import { Item } from "../types/menu";

export const createCategory = (
  restaurantId: number,
  name: string,
  displayOrder: number
) => {
  return menuRepo.createCategory(restaurantId, name, displayOrder);
};

export const createCategoryItem = async (
  restaurantId: number,
  categoryId: number,
  displayOrder: number,
  item: Item
) => {
  const category = await menuRepo.getCategoryById(categoryId);
  if (category?.restaurantId !== restaurantId) {
    throw new NotFound("This category does not exist...");
  }
  return menuRepo.createCategoryItem(categoryId, displayOrder, item);
};

export const getMenu = async (restaurantId: number) => {
  const menu = await menuRepo.getMenu(restaurantId);
  menu.sort((a, b) => a.displayOrder - b.displayOrder);
  return menu;
};
