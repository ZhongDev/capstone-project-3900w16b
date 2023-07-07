import { raw } from "objection";
import Restaurant from "../models/Restaurant";
import Table from "../models/Table";
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

export const getRestaurantById = async (
  id: number
): Promise<Restaurant | undefined> => {
  return Restaurant.query().findOne({
    id,
  });
};

export const createRestaurantTable = async (restaurantId: number) => {
  const newTable = await Table.query().insert({
    displayOrder: raw(
      "COALESCE(?, 0) + 1",
      Table.query().max("displayOrder").where({
        restaurantId,
      })
    ),
    restaurantId,
  });
  return Table.query().findOne({ id: newTable.id });
};

export const getRestaurantTables = (restaurantId: number) => {
  return Table.query()
    .where({
      restaurantId,
    })
    .orderBy("table.displayOrder");
};

export const getRestaurantTableById = (tableId: number) => {
  return Table.query().findOne({
    id: tableId,
  });
};

export const getRestaurantTableRestaurant = async (id: number) => {
  const table = await Table.query()
    .findById(id)
    .withGraphFetched("table.restaurant");
  return table?.restaurant;
};

export const deleteRestaurantTable = async (id: number) => {
  return Table.query().where("id", id).del();
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
