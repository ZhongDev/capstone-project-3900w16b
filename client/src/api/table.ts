import request from "./request";

export type Table = {
  id: number;
  restaurantId: number;
  name: string;
};

export type GetTableResponse = {
  restaurant: { name: string };
  tables: Table[];
};

export const getRestaurantTables = () => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/restaurant/table")
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetTableResponse>;
};

export const getRestaurantTableById = (tableId: number) => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/restaurant/table/" + tableId)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<Table>;
};

export const getTableNameById = (tableId: number) => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/restaurant/tableName/" + tableId)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<string>;
};

export const deleteRestaurantTable = (tableId: number) => {
  return request
    .delete(process.env.NEXT_PUBLIC_BASEURL + "/restaurant/table/" + tableId)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetTableResponse>;
};

export type CreateTableResponse = {
  id: number;
  restaurantId: number;
  name: string;
};

export const createTable = (name: string) => {
  return request
    .post(process.env.NEXT_PUBLIC_BASEURL + "/restaurant/table", {
      name,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateTableResponse>;
};

export const checkTable = (restaurantId: number, tableName: string) => {
  return request
    .get(
      process.env.NEXT_PUBLIC_BASEURL +
        "/restaurant/" +
        restaurantId +
        "/" +
        tableName
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<Table>;
};
