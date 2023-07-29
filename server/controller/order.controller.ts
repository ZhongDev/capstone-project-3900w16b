import { CreateOrderRequest } from "../schema/order.schema";
import * as orderService from "../service/order.service";
import { Router } from "express";
import auth from "./middleware/auth";

const router = Router();

router.post("/statusComplete/:orderGroupId", async (req, res, next) => {
  console.log("nooo");
  try {
    const status = await orderService.changeOrderToComplete(
      Number(req.params.orderGroupId)
    );
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post("/statusOrdered/:orderGroupId", async (req, res, next) => {
  try {
    const status = await orderService.changeOrderToOrdered(
      Number(req.params.orderGroupId)
    );
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post("/statusPrepared/:orderGroupId", async (req, res, next) => {
  //console.log("a");
  try {
    //console.log("whyyy");
    const status = await orderService.changeOrderToPrepared(
      Number(req.params.orderGroupId)
    );
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post("/:restaurantId/:tableId", async (req, res, next) => {
  try {
    const { items, device } = CreateOrderRequest.parse(req.body);
    const order = await orderService.createOrder(
      Number(req.params.restaurantId),
      Number(req.params.tableId),
      device,
      items.map((item) => ({
        itemId: item.itemId,
        units: item.units,
        status: "ordered",
        placedOn: new Date().toISOString(),
      }))
    );

    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.get("/:restaurantId/:deviceId", async (req, res, next) => {
  try {
    res.json(
      await orderService.getRestaurantOrdersByDeviceId(
        Number(req.params.restaurantId),
        req.params.deviceId
      )
    );
  } catch (err) {
    next(err);
  }
});

// Controls get of orders
router.get("/orders", auth, async (req, res, next) => {
  try {
    //console.log("succ");
    //console.log("testttttttttttttttttttttt");
    const tables = await orderService.getOrdersByRestaurantId(
      req.restaurant!.restaurantId
    );
    //console.log(tables[0]);
    res.json(
      await orderService.getOrdersByRestaurantId(req.restaurant!.restaurantId)
    );
  } catch (err) {
    next(err);
  }
});

router.post("/statusComplete/:orderGroupId", async (req, res, next) => {
  try {
    const status = await orderService.changeOrderToComplete(
      Number(req.params.orderGroupId)
    );
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post("/statusOrdered/:orderGroupId", async (req, res, next) => {
  try {
    const status = await orderService.changeOrderToOrdered(
      Number(req.params.orderGroupId)
    );
    res.json(status);
  } catch (err) {
    next(err);
  }
});

export default router;
