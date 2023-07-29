import { Router } from "express";
import * as helpService from "../service/help.service";
import HelpCall, { HelpCallStatus } from "../models/HelpCall";
import * as schema from "../schema/help.schema";
import auth from "./middleware/auth";

const router = Router();

// Controls creation of help requests
router.post("/:restaurantId/:tableId", async (req, res, next) => {
  try {
    const newHelpCall = await helpService.createHelpCall(
      Number(req.params.restaurantId),
      Number(req.params.tableId),
      "unresolved",
      new Date().toISOString()
    );
    res.json(newHelpCall);
  } catch (err) {
    next(err);
  }
});

// Controls updating status of a help call
router.patch("/:tableId", auth, async (req, res, next) => {
  try {
    const updateRequest = schema.UpdateHelpCallRequest.parse(req.body);
    res.json(
      await helpService.updateHelpCallStatusTable(
        req.restaurant!.restaurantId,
        Number(req.params.tableId),
        updateRequest.newStatus as HelpCallStatus
      )
    );
  } catch (err) {
    next(err);
  }
});

// Delete help call
router.delete("/:helpCallId", auth, async (req, res, next) => {
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
router.get("", auth, async (req, res, next) => {
  try {
    const menu = await helpService.getAllUnresolvedHelpCalls(
      req.restaurant!.restaurantId
    );
    res.json(menu);
  } catch (err) {
    next(err);
  }
});

export default router;
