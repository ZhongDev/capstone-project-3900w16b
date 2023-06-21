import request from "./request";

export const getMe = () =>
  request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/me")
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<{ restaurantId: number }>;
