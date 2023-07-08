import { Router } from "express";
import * as menuService from "../service/menu.service";
import * as schema from "../schema/menu.schema";
import auth from "./middleware/auth";

const router = Router();

// Controls creation of menu category
router.post("/category", auth, async (req, res, next) => {
  try {
    const category = schema.CreateCategoryRequest.parse(req.body);
    const menuCategory = await menuService.createCategory(
      req.restaurant!.restaurantId,
      category.name
    );
    res.json(menuCategory);
  } catch (err) {
    next(err);
  }
});

// Controls updating of category information
router.patch("/category/:categoryId", auth, async (req, res, next) => {
  try {
    const updateRequest = schema.UpdateCategoryRequest.parse(req.body);
    res.json(
      await menuService.updateCategory(
        req.restaurant!.restaurantId,
        Number(req.params.categoryId),
        updateRequest
      )
    );
  } catch (err) {
    next(err);
  }
});

// Controls deleting of menu categories
router.delete("/category/:categoryId", auth, async (req, res, next) => {
  try {
    const categoryItem = await menuService.deleteCategory(
      req.restaurant!.restaurantId,
      Number(req.params.categoryId)
    );
    res.json(categoryItem);
  } catch (err) {
    next(err);
  }
});

router.get("/item/:itemId", async (req, res, next) => {
  try {
    const item = await menuService.getMenuItem(Number(req.params.itemId));
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Controls creation of new menu items
router.post("/item", auth, async (req, res, next) => {
  try {
    const newItem = schema.CreateItemRequest.parse(req.body);
    const categoryItem = await menuService.createCategoryItem(
      req.restaurant!.restaurantId,
      newItem.categoryId,
      newItem.item
    );
    res.json(categoryItem);
  } catch (err) {
    next(err);
  }
});

// Controls updating of menu item information
router.patch("/item/:itemId", auth, async (req, res, next) => {
  try {
    const updateRequest = schema.UpdateItemRequest.parse(req.body);
    const categoryItem = await menuService.updateCategoryItem(
      req.restaurant!.restaurantId,
      Number(req.params.itemId),
      updateRequest
    );
    res.json(categoryItem);
  } catch (err) {
    next(err);
  }
});

// Controls deleting of menu items
router.delete("/item/:itemId", auth, async (req, res, next) => {
  try {
    const categoryItem = await menuService.deleteCategoryItem(
      req.restaurant!.restaurantId,
      Number(req.params.itemId)
    );
    res.json(categoryItem);
  } catch (err) {
    next(err);
  }
});

// Get menu as customer
router.get("/:restaurantId", async (req, res, next) => {
  try {
    const menu = await menuService.getMenu(Number(req.params.restaurantId));
    res.json(menu);
  } catch (err) {
    next(err);
  }
});

// Get menu as authorised user
router.get("/", auth, async (req, res, next) => {
  try {
    const menu = await menuService.getMenu(req.restaurant!.restaurantId);
    res.json(menu);
  } catch (err) {
    next(err);
  }
});

export default router;
