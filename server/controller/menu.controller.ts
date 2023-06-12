import { Router } from "express";
import * as menuService from "../service/menu.service";
import * as schema from "../schema/menu";
import auth from "./middleware/auth";

const router = Router();

router.post("/category", auth, async (req, res, next) => {
  try {
    const category = schema.Category.parse(req.body);
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

export default router;
