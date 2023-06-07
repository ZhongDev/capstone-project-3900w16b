import { config } from "dotenv";
config();

import express, { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import restaurantController from "./controller/restaurant.controller";
import "./db";
import CustomError from "./errors/CustomError";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/restaurant", restaurantController);

app.use("*", (req, res, next) => {
  res.status(404).send("Not found");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json(err);
  } else if (err instanceof CustomError) {
    res.status(err.status).json({ msg: err.message });
  } else if (err) {
    res.status(500).json(err.message);
  }
});

app.listen(process.env.PORT, () => console.log("Running on", process.env.PORT));
