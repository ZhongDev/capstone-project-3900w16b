import { Router } from "express";
import * as helpService from "../service/help.service";
import HelpCall, { HelpCallStatus } from "../models/HelpCall";
import * as schema from "../schema/help.schema";
import auth from "./middleware/auth";

const router = Router();

// Controls creation of help requests
router.post("/:restaurantId/:tableId", async (req, res, next) => {
  const helpCall = schema.CreateHelpCallRequest.parse(req.body);
  try {
    const newHelpCall = await helpService.createHelpCall(
      req.restaurant!.restaurantId,
      helpCall.tableId,
      "unresolved",
      helpCall.device,
      new Date().toISOString()
    );
    res.json(newHelpCall);
  } catch (err) {
    next(err);
  }
});

// Controls updating status of a help call
router.patch("/helpCall/:helpCallId", auth, async (req, res, next) => {
  try {
    const updateRequest = schema.UpdateHelpCallRequest.parse(req.body);
    res.json(
      await helpService.updateHelpCallStatus(
        req.restaurant!.restaurantId,
        Number(req.params.helpCallId),
        updateRequest.newStatus as HelpCallStatus
      )
    );
  } catch (err) {
    next(err);
  }
});

// Delete help call
router.delete("/helpCall/:helpCallId", auth, async (req, res, next) => {
  try {
    const categoryItem = await helpService.deleteHelpCall(
      req.restaurant!.restaurantId,
      Number(req.params.helpCallId)
    );
    res.json(categoryItem);
  } catch (err) {
    next(err);
  }
});

// Get all unresolved help calls
router.get("/helpCall", auth, async (req, res, next) => {
  try {
    const menu = await helpService.getAllUnresolvedHelpCalls(
      req.restaurant!.restaurantId
    );
    res.json(menu);
  } catch (err) {
    next(err);
  }
});
