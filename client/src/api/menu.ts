import request from "./request";

export type Menu = {
  id: number;
  restaurantId: number;
  displayOrder: number;
  name: string;
  items: MenuItem[];
};

export type GetMenuResponse = {
  restaurant: { name: string };
  menu: Menu[];
};

export type MenuItem = {
  id: number;
  categoryId: number;
  displayOrder: number;
  name: string;
  image: string | null;
  priceCents: number;
  description: string;
  ingredients: string | null;
};

export const getMenu = () => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/menu")
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetMenuResponse>;
};

export const getMenuByRestaurantId = (restaurantId: number) => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/menu/" + restaurantId, {
      withCredentials: false,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetMenuResponse>;
};

export type CreateCategoryResponse = {
  displayOrder: number;
  name: string;
  restaurantId: number;
  id: number;
};

export const createCategory = (name: string) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/menu/category", {
      name,
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
      item,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateItemResponse>;
};

export type GetMenuItemResponse = MenuItem;

export const getMenuItem = (itemId: number) => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/menu/item/" + itemId, {
      withCredentials: false,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<MenuItem>;
};

export type UpdateItemResponse = {
  itemId: number;
  name: string;
  description: string;
  ingredients: string | null;
  priceCents: number;
  displayOrder: number;
};

export const updateMenuItem = (
  itemId: number,
  updateItem: {
    name: string;
    description: string;
    ingredients: string | null;
    priceCents: number;
    displayOrder: number;
  }
) => {
  return request
    .patch(process.env.NEXT_PUBLIC_BASEURL + "/menu/item/" + itemId, {
      updateItem,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<UpdateItemResponse>; // might be wrong
};

export type DeleteItemResponse = {
  // TODO:
  // 200
  // 500
};

export const deleteMenuItem = (itemId: number) => {
  return request
    .delete(process.env.NEXT_PUBLIC_BASEURL + "menu/item/" + itemId)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<DeleteItemResponse>; // ???
};
