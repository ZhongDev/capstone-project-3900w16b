import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, verify } from "jsonwebtoken";
import Unauthorized from "../../errors/Unauthorized";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = (await verifyJWT(req.cookies["Authorization"])) as {
      restaurantId: number;
    };
    req.restaurant = payload;
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      next(new Unauthorized("Invalid credentials"));
      return;
    }
    next(err);
  }
};

const verifyJWT = (token: string) =>
  new Promise((resolve, reject) => {
    if (!process.env.JWT_KEY) {
      reject(new Error("No JWT key set"));
      return;
    }
    jwt.verify(token, process.env.JWT_KEY, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
export default auth;
