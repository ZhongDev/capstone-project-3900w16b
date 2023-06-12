import { Router } from "express";
import { Restaurant } from "../schema/restaurant";
import * as restaurantService from "../service/restaurant.service";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { email, name, password } = Restaurant.parse(req.body ?? {});
    const restaurant = await restaurantService.createRestaurant(
      email,
      name,
      password
    );
    const token = await signJWT({
      restaurantId: restaurant.id,
    });
    res.cookie("Authorization", token).json(restaurant);
  } catch (err) {
    next(err);
  }
});

const signJWT = (payload: Record<string, any>): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    if (!process.env.JWT_KEY) {
      reject(new Error("No JWT key set"));
      return;
    }
    jwt.sign(payload, process.env.JWT_KEY, (err, token) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  });

export default router;
