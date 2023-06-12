import Category from "../models/Category";

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

export const getMenu = (restaurantId: number) => {
  return Category.query().where({ restaurantId });
};
