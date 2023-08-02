import { CreateOrderRequest } from "../schema/order.schema";
import * as orderService from "../service/order.service";
import { Router } from "express";
import auth from "./middleware/auth";
import BadRequest from "../errors/BadRequest";

const router = Router();

router.get("/timeAgo/:orderGroupId", async (req, res, next) => {
  try {
    const time = await orderService.getOrderTimeAgo(
      Number(req.params.orderGroupId)
    );
    res.json(time);
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

router.post("/statusPrepared/:orderGroupId", async (req, res, next) => {
  try {
    const status = await orderService.changeOrderToPrepared(
      Number(req.params.orderGroupId)
    );
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post("/OrderItemReady/:orderItemId", async (req, res, next) => {
  try {
    const status = await orderService.changeOrderItemToReady(
      Number(req.params.orderItemId)
    );
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post("/OrderItemReady/:orderItemId/notReady", async (req, res, next) => {
  try {
    const status = await orderService.changeOrderItemToNotReady(
      Number(req.params.orderItemId)
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
        alterations: item.alterations,
        status: "ordered",
        itemStatus: "notready",
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
    res.json(
      await orderService.getOrdersByRestaurantId(req.restaurant!.restaurantId)
    );
  } catch (err) {
    next(err);
  }
});

router.patch("/orderGroup/:orderGroupId/paid", auth, async (req, res, next) => {
  try {
    const orderGroupId = Number(req.params.orderGroupId);
    if (isNaN(orderGroupId)) {
      throw new BadRequest("Invalid order group id");
    }
    res.json(
      await orderService.markOrderGroupAsPaid(
        req.restaurant!.restaurantId,
        orderGroupId
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

router.get("/:restaurantId/summary/:from/:to", async (req, res, next) => {
  try {
    res.json(
      await orderService.getRestaurantOrders(
        Number(req.params.restaurantId),
        req.params.from,
        req.params.to
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
