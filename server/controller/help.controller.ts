import { Router } from "express";
import * as helpService from "../service/help.service";

const router = Router();

// Controls creation of help requests
router.post("/help", async (req, res, next) => {
    try {
        const helpRequest = schema.CreateCategoryRequest.parse(req.body);
        const menuCategory = await helpService.createHelpRequest(
          req.restaurant!.restaurantId,
          helpRequest.name
        );
        res.json(menuCategory);
    } catch (err) {
        next(err);
    }
});