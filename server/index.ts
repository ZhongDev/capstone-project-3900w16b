import { config } from "dotenv";
config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookie from "cookie-parser";
import { ZodError } from "zod";
import restaurantController from "./controller/restaurant.controller";
import menuController from "./controller/menu.controller";
import orderController from "./controller/order.controller";
import helpController from "./controller/help.controller";
import "./db";
import CustomError from "./errors/CustomError";
import auth from "./controller/middleware/auth";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

app.use("/restaurant", restaurantController);
app.use("/menu", menuController);
app.use("/order", orderController);
app.use("/help", helpController);

app.get("/me", auth, (req, res, next) => {
  res.send(req.restaurant);
});

app.use("*", (req, res) => {
  res.status(404).send("Not found");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json(err);
  } else if (err instanceof CustomError) {
    res.status(err.status).json({ msg: err.message });
  } else {
    console.error("Error: ", err);
    res.status(500).json("Internal Server Error");
  }
});

app.listen(process.env.PORT, () => console.log("Running on", process.env.PORT));
