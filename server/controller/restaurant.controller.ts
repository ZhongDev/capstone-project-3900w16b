import { Router } from "express";
import * as schema from "../schema/restaurant.schema";
import * as restaurantService from "../service/restaurant.service";
import auth from "./middleware/auth";
import jwt from "jsonwebtoken";
import Unauthorized from "../errors/Unauthorized";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, name, password } = schema.CreateRestaurantRequest.parse(
      req.body ?? {}
    );
    const restaurant = await restaurantService.createRestaurant(
      email,
      name,
      password
    );
    const token = await signJWT({
      restaurantId: restaurant.id,
      name: restaurant.name,
    });
    res.cookie("Authorization", token).json(restaurant);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = schema.LoginRequest.parse(req.body ?? {});
    const restaurant = await restaurantService.login(email, password);
    const token = await signJWT({
      restaurantId: restaurant.id,
      name: restaurant.name,
    });
    res.cookie("Authorization", token).json(restaurant);
  } catch (err) {
    next(err);
  }
});

// Controls creation of tables
router.post("/table", auth, async (req, res, next) => {
  try {
    const table = schema.CreateTableRequest.parse(req.body);
    const resTable = await restaurantService.createRestaurantTable(
      req.restaurant!.restaurantId,
      table.name
    );
    res.json(resTable);
  } catch (err) {
    next(err);
  }
});

// controls getting table by Id
router.get("/table/:tableId", async (req, res, next) => {
  try {
    const table = await restaurantService.getRestaurantTable(
      Number(req.params.tableId)
    );
    res.json(table);
  } catch (err) {
    next(err);
  }
});

// controls getting tableName by Id
router.get("/tableName/:tableId", async (req, res, next) => {
  try {
    const name = await restaurantService.getRestaurantTableName(
      Number(req.params.tableId)
    );
    res.json(name);
  } catch (err) {
    next(err);
  }
});

// controls deletion of table
router.delete("/table/:tableId", auth, async (req, res, next) => {
  try {
    const table = await restaurantService.getRestaurantTable(
      Number(req.params.tableId)
    );

    const tableRest = table?.restaurantId;

    if (tableRest === req.restaurant?.restaurantId) {
      const tableItem = await restaurantService.deleteRestaurantTable(
        Number(req.params.tableId)
      );
      res.json(tableItem);
    } else {
      throw new Unauthorized("You are not the restaurant I am looking for");
    }
  } catch (err) {
    next(err);
  }
});

// Controls get of tables
router.get("/table", auth, async (req, res, next) => {
  try {
    const tables = await restaurantService.getRestaurantTables(
      req.restaurant!.restaurantId
    );
    res.json(tables);
  } catch (err) {
    next(err);
  }
});

router.get("/:restaurantId/:tableName", async (req, res, next) => {
  try {
    const restaurant = await restaurantService.checkRestaurantTable(
      Number(req.params.restaurantId),
      req.params.tableName
    );
    res.json(restaurant);
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
