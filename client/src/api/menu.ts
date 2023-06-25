import request from "./request";

export type GetMenuResponse = {
  id: number;
  restaurantId: number;
  displayOrder: number;
  name: string;
  items: MenuItem[];
};
export type MenuItem = {
  id: number;
  categoryId: number;
  displayOrder: number;
  name: string;
  image: string | null;
  priceCents: number;
};
export const getMenu = () => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/menu")
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetMenuResponse[]>;
};

export type CreateCategoryResponse = {
  displayOrder: number;
  name: string;
  restaurantId: number;
  id: number;
};
export const createCategory = (name: string, displayOrder: number) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/menu/category", {
      name,
      displayOrder,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateCategoryResponse>;
};

export type CreateItemResponse = {
  categoryId: number;
  displayOrder: number;
  name: string;
  priceCents: number;
  id: number;
};
export const createItem = (
  categoryId: number,
  displayOrder: number,
  item: {
    name: string;
    description: string;
    ingredients: string | null;
    priceCents: number;
  }
) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/menu/item", {
      categoryId,
      displayOrder,
      item,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateItemResponse>;
};
