import { Router } from "express";
import { Restaurant } from "../schema/restaurant";
import * as restaurantService from "../service/restaurant.service";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { email, name, password } = Restaurant.parse(req.body ?? {});
    const restaurant = await restaurantService.createRestaurant(
      email,
      name,
      password
    );
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
});

export default router;
