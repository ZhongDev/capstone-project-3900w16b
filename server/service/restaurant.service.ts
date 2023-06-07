import { UniqueViolationError } from "objection";
import BadRequest from "../errors/BadRequest";
import * as restaurantRepo from "../repository/restaurant.repository";

export const createRestaurant = async (
  email: string,
  name: string,
  password: string
) => {
  try {
    return await restaurantRepo.createRestaurant(email, name, password);
  } catch (err) {
    if (err instanceof UniqueViolationError) {
      throw new BadRequest("Email already exists");
    }
    throw err;
  }
};
