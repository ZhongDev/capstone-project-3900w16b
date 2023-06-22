import Restaurant from "../models/Restaurant";
import bcrypt from "bcrypt";

export const createRestaurant = async (
  email: string,
  name: string,
  password: string
): Promise<Restaurant> => {
  return Restaurant.query().insert({
    email,
    name,
    password,
  });
};

export const getRestaurantByEmail = async (
  email: string
): Promise<Restaurant | undefined> => {
  return Restaurant.query().findOne({
    email,
  });
};

const promiseHash = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(hash);
    });
  });
