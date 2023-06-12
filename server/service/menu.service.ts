import { UniqueViolationError } from "objection";
import BadRequest from "../errors/BadRequest";
import * as categoryRepo from "../repository/menu.repository";

export const createCategory = (
  restaurantId: number,
  name: string,
  displayOrder: number
) => {
  return categoryRepo.createCategory(restaurantId, name, displayOrder);
};

export const getMenu = async (restaurantId: number) => {
  const menu = await categoryRepo.getMenu(restaurantId);
  menu.sort((a, b) => a.displayOrder - b.displayOrder);
  return menu;
};
