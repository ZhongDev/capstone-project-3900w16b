import Restaurant from "../models/Restaurant";
import bcrypt from "bcrypt";

export const createRestaurant = async (
  email: string,
  name: string,
  password: string
): Promise<Restaurant> => {
  const hash = await promiseHash(password);
  return Restaurant.query().insert({
    email,
    name,
    password: hash,
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
