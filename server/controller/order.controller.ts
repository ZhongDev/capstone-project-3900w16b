import { CreateOrderRequest } from "../schema/order.schema";
import * as orderService from "../service/order.service";
import { Router } from "express";

const router = Router();

router.post("/:restaurantId/:tableId", async (req, res, next) => {
  try {
    const item = CreateOrderRequest.parse(req.body);
    const order = await orderService.createOrder(
      Number(req.params.restaurantId),
      Number(req.params.tableId),
      {
        itemId: item.itemId,
        units: item.units,
        status: "ordered",
        placedOn: new Date().toISOString(),
        device: item.device,
      }
    );

    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
