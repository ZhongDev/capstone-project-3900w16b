import { CreateOrderRequest } from "../schema/order.schema";
import * as orderService from "../service/order.service";
import { Router } from "express";

const router = Router();

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

router.get(
  "/:restaurantId/orderGroup/:orderGroupId",
  async (req, res, next) => {
    try {
      res.json(
        await orderService.getOrderGroupById(Number(req.params.orderGroupId))
      );
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:restaurantId/orders/:orderGroupId", async (req, res, next) => {
  try {
    res.json(
      await orderService.getOrdersByOrderGroupId(
        Number(req.params.orderGroupId)
      )
    );
  } catch (err) {
    next(err);
  }
});

router.get("/:restaurantId/est/:orderGroupId", async (req, res, next) => {
  try {
    res.json(
      await orderService.getEstTimeByOrderGroupId(
        Number(req.params.restaurantId),
        Number(req.params.orderGroupId)
      )
    );
  } catch (err) {
    next(err);
  }
});
export default router;
