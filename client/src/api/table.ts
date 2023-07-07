import request from "./request";

export type Table = {
    id: number;
    restaurantId: number;
    name: string;

};

export type GetTableResponse = {
    restaurant: { name: string };
    table: Table[];
};

export type CreateTableResponse = {
    name: string;
    restaurantId: number;
    id: number;
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
