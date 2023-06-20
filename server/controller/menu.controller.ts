import { Router } from "express";
import * as menuService from "../service/menu.service";
import * as schema from "../schema/menu";
import auth from "./middleware/auth";

const router = Router();

router.post("/category", auth, async (req, res, next) => {
  try {
    const category = schema.CreateCategoryRequest.parse(req.body);
    const menuCategory = await menuService.createCategory(
      req.restaurant!.restaurantId,
      category.name,
      category.displayOrder
    );
    res.json(menuCategory);
  } catch (err) {
    next(err);
  }
});

router.post("/item", auth, async (req, res, next) => {
  try {
    const newItem = schema.CreateItemRequest.parse(req.body);
    const categoryItem = await menuService.createCategoryItem(
      req.restaurant!.restaurantId,
      newItem.categoryId,
      newItem.displayOrder,
      newItem.item
    );
    res.json(categoryItem);
  } catch (err) {
    next(err);
  }
});

router.get("/:restaurantId", async (req, res, next) => {
  try {
    const menu = await menuService.getMenu(Number(req.params.restaurantId));
    res.json(menu);
  } catch (err) {
    next(err);
  }
});

export default router;
