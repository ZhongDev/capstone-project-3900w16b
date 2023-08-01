import request from "./request";

export type Menu = {
  id: number;
  displayOrder: number;
  name: string;
  items: MenuItem[];
};

export type GetMenuResponse = {
  restaurant: { name: string; id: number };
  menu: Menu[];
};

export type Alteration = {
  id: number;
  optionName: string;
  maxChoices: number;
  options: {
    choice: string;
    id: number;
  }[];
};

export type MenuItem = {
  id: number;
  categoryId: number;
  displayOrder: number;
  name: string;
  image: string | null;
  imageMimeType: string | null;
  priceCents: number;
  description: string;
  ingredients: string | null;
  minPrepMins: number | null;
  maxPrepMins: number | null;
  alterations: Alteration[];
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

export const reorderCategories = (newCategoryOrder: number[]) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/menu/displayOrder", {
      categoryOrder: newCategoryOrder,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetMenuResponse>;
};

export const reorderItems = (categoryId: number, newItemOrder: number[]) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/menu/item/displayOrder", {
      categoryId,
      itemOrder: newItemOrder,
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

export type UpdateCategoryResponse = {
  itemId: number;
  name: string;
};

export const updateMenuCategory = (
  categoryId: number,
  updateCategory: {
    name: string;
  }
) => {
  return request
    .patch(
      process.env.NEXT_PUBLIC_BASEURL + "/menu/category/" + categoryId,
      updateCategory
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<UpdateCategoryResponse>;
};

export const deleteMenuCategory = (categoryId: number) => {
  return request
    .delete(process.env.NEXT_PUBLIC_BASEURL + "/menu/category/" + categoryId)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<void>;
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
    minPrepMins: number;
    maxPrepMins: number;
    alterations?: {
      optionName: string;
      maxChoices: number;
      options: string[];
    }[];
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

export type GetItemPrepTimeResponse = {
  minPrepTime: number;
  maxPrepTime: number;
};

export const getMenuItemPrep = (itemId: number) => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/menu/item/prep/" + itemId, {
      withCredentials: false,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetItemPrepTimeResponse>;
};

export type UpdateItemResponse = MenuItem;

export const updateMenuItem = (
  itemId: number,
  updateItem: {
    name: string;
    description: string;
    ingredients: string | null;
    priceCents: number;
    minPrepMins: number;
    maxPrepMins: number;
  }
) => {
  return request
    .patch(process.env.NEXT_PUBLIC_BASEURL + "/menu/item/" + itemId, updateItem)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<UpdateItemResponse>;
};

export const deleteMenuItem = (itemId: number) => {
  return request
    .delete(process.env.NEXT_PUBLIC_BASEURL + "/menu/item/" + itemId)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<void>;
};

export const deleteAlteration = (alterationId: number) => {
  return request
    .delete(
      process.env.NEXT_PUBLIC_BASEURL + "/menu/alteration/" + alterationId
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<void>;
};

export type CreateAlterationRequest = {
  maxChoices: number;
  optionName: string;
  itemId: number;
  options: string[];
};

export type CreateAlterationResponse = MenuItem;

export const createAlteration = (newAlteration: CreateAlterationRequest) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/menu/alteration", newAlteration)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateAlterationResponse>;
};

export type UpdateAlterationResponse = {
  id: number;
  optionName: string;
  maxChoices: number;
};

export type UpdateAlterationRequest = {
  id: number;
  optionName: string;
  maxChoices: number;
};

export const updateAlteration = (
  updatedAlteration: UpdateAlterationRequest
) => {
  return request
    .patch(
      process.env.NEXT_PUBLIC_BASEURL +
        "/menu/alteration/" +
        updatedAlteration.id,
      {
        maxChoices: updatedAlteration.maxChoices,
        optionName: updatedAlteration.optionName,
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<UpdateAlterationResponse>;
};

export type CreateAlterationOptionRequest = {
  alterationId: number;
  choice: string;
};

export type CreateAlterationOptionRespose = Alteration;

export const createAlterationOption = (
  newAlterationOption: CreateAlterationOptionRequest
) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/menu/alterationOption/", {
      alterationId: newAlterationOption.alterationId,
      choice: newAlterationOption.choice,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateAlterationOptionRespose>;
};

export const deleteAlterationOption = (alterationOptionId: number) => {
  return request
    .delete(
      process.env.NEXT_PUBLIC_BASEURL +
        "/menu/alterationOption/" +
        alterationOptionId
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<number>;
};

export const uploadItemImage = (itemId: number, image: File) => {
  const form = new FormData();
  form.append("image", image);
  form.append("itemId", itemId.toString());
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/menu/itemImage", form)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<MenuItem>;
};
