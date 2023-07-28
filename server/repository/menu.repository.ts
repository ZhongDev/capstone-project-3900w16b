import { raw } from "objection";
import Item from "../models/Item";
import Category from "../models/Category";
import {
  Item as ItemType,
  ItemAlteration,
  UpdateAlteration,
  UpdateCategory,
  UpdateItem,
} from "../types/menu";
import Alteration from "../models/Alteration";
import AlterationOption from "../models/AlterationOption";

// Creates menu category
export const createCategory = async (restaurantId: number, name: string) => {
  const newCategory = await Category.query().insert({
    displayOrder: raw(
      "COALESCE(?, 0) + 1",
      Category.query().max("displayOrder").where({
        restaurantId,
      })
    ),
    name,
    restaurantId,
  });
  return Category.query().findOne({ id: newCategory.id });
};

// Update information about menu category
export const updateCategory = async (
  categoryId: number,
  updateFields: UpdateCategory
) => {
  await Category.query()
    .patch({
      name: updateFields.name,
      displayOrder: updateFields.displayOrder,
    })
    .where({ id: categoryId });

  return Category.query().findOne({ id: categoryId });
};

// Get Category
export const getCategories = (restaurantId: number) => {
  return Category.query()
    .where({
      restaurantId,
    })
    .orderBy("category.displayOrder");
};

// Given categoryId, find category
export const getCategoryById = (categoryId: number) => {
  return Category.query().findOne({
    id: categoryId,
  });
};

// Delete the category with categoryId in Categories
export const deleteCategory = async (categoryId: number) => {
  return Category.query().where("id", categoryId).del();
};

// Creates an item in the category with categoryId
export const createCategoryItem = async (
  categoryId: number,
  item: ItemType
) => {
  const createdItem = await Item.transaction(async (trx) => {
    const newItem = await Item.query(trx).insert({
      categoryId,
      displayOrder: raw(
        "COALESCE(?, 0) + 1",
        Item.query().max("displayOrder").where({ categoryId })
      ),
      name: item.name,
      priceCents: item.priceCents,
      description: item.description,
      ingredients: item.ingredients,
      minPrepMins: item.minPrepMins,
      maxPrepMins: item.maxPrepMins,
    });

    if (item.alterations) {
      await Promise.all(
        item.alterations.map(async (alteration) => {
          const itemAlteration = await Alteration.query(trx).insert({
            itemId: newItem.id,
            optionName: alteration.optionName,
            maxChoices: alteration.maxChoices,
          });
          return Promise.all(
            alteration.options.map((alterationOption) => {
              return AlterationOption.query(trx).insert({
                alterationId: itemAlteration.id,
                choice: alterationOption,
              });
            })
          );
        })
      );
    }

    return newItem;
  });

  return getItem(createdItem.id);
};

export const getItem = async (itemId: number) => {
  return Item.query().findById(itemId).withGraphFetched("alterations.options");
};

// Get a given item's restaurant
export const getCategoryItemRestaurant = async (id: number) => {
  const item = await Item.query()
    .findById(id)
    .withGraphFetched("category.restaurant");
  return item?.category?.restaurant;
};

// Update information about an item
export const updateCategoryItem = async (
  id: number,
  updateItem: UpdateItem
) => {
  await Item.query()
    .patch({
      name: updateItem.name,
      displayOrder: updateItem.displayOrder,
      description: updateItem.description,
      ingredients: updateItem.ingredients,
      priceCents: updateItem.priceCents,
      minPrepMins: updateItem.minPrepMins,
      maxPrepMins: updateItem.maxPrepMins,
    })
    .where({ id });
  return getItem(id);
};

export const createAlteration = async (
  itemId: number,
  alteration: ItemAlteration
) => {
  await Alteration.transaction(async (trx) => {
    const newAlteration = await Alteration.query(trx).insert({
      itemId,
      maxChoices: alteration.maxChoices,
      optionName: alteration.optionName,
    });
    await Promise.all(
      alteration.options.map((option) => {
        return AlterationOption.query(trx).insert({
          alterationId: newAlteration.id,
          choice: option,
        });
      })
    );
  });

  return getItem(itemId);
};

export const getAlteration = async (alterationId: number) => {
  return Alteration.query().findById(alterationId).withGraphFetched("options");
};

export const getAlterationRestaurant = async (alterationId: number) => {
  const alteration = await Alteration.query()
    .findById(alterationId)
    .withGraphFetched("item.category.restaurant");

  return alteration?.item?.category?.restaurant;
};

export const getAlterationOptionRestaurant = async (
  alterationOptionId: number
) => {
  const alterationOption = await AlterationOption.query()
    .findById(alterationOptionId)
    .withGraphFetched("alteration.item.category.restaurant");

  return alterationOption?.alteration?.item?.category?.restaurant;
};

export const updateAlteration = async (
  alterationId: number,
  { maxChoices, optionName }: UpdateAlteration
) => {
  await Alteration.query()
    .patch({
      maxChoices,
      optionName,
    })
    .where({ id: alterationId });

  return Alteration.query().findById(alterationId);
};

export const deleteAlteration = async (alterationId: number) => {
  return Alteration.query()
    .where({
      id: alterationId,
    })
    .del();
};

export const createAlterationOption = async (
  alterationId: number,
  choice: string
) => {
  return AlterationOption.query().insert({
    alterationId,
    choice,
  });
};

export const updateAlterationOption = async (
  alterationId: number,
  choice: string
) => {
  return AlterationOption.query()
    .patch({
      choice,
    })
    .where({ id: alterationId })
    .returning("*");
};

export const deleteAlterationOption = async (alterationOptionId: number) => {
  return AlterationOption.query().where({ id: alterationOptionId }).del();
};

// Delete an item on the menu
export const deleteCategoryItem = async (id: number) => {
  return Item.query().where("id", id).del();
};

// Get the entire menu database given a restaurantId
export const getMenu = (restaurantId: number) => {
  return Category.query()
    .select(["category.id", "category.displayOrder", "category.name"])
    .where({ restaurantId })
    .withGraphJoined("items.alterations.options")
    .orderBy("category.displayOrder")
    .orderBy("items.displayOrder");
};

export const reorderCategories = async (
  restaurantId: number,
  newOrderedCategoryIds: number[]
) => {
  return Category.transaction(async (trx) => {
    return Promise.all(
      newOrderedCategoryIds.map((categoryId, i) => {
        return Category.query(trx)
          .update({
            displayOrder: i + 1,
          })
          .where({
            id: categoryId,
            restaurantId,
          });
      })
    );
  });
};

export const reorderItems = async (
  categoryId: number,
  newOrderedItemIds: number[]
) => {
  return Item.transaction(async (trx) => {
    return Promise.all(
      newOrderedItemIds.map((itemId, i) => {
        return Item.query(trx)
          .update({
            displayOrder: i + 1,
          })
          .where({
            id: itemId,
            categoryId,
          });
      })
    );
  });
};
