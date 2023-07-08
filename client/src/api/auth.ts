import request from "./request";

export type GetMeResponse = { restaurantId: number };
export const getMe = () =>
    request
        .get(process.env.NEXT_PUBLIC_BASEURL + "/me")
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }) as Promise<GetMeResponse>;

export type AuthResponse = {
    email: string;
    name: string;
    id: number;
};
export const registerRestaurant = ({
    email,
    name,
    password,
}: {
    email: string;
    name: string;
    password: string;
}) => {
    return request
        .post(process.env.NEXT_PUBLIC_BASEURL + "/restaurant/register", {
            email,
            name,
            password,
        })
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }) as Promise<AuthResponse>;
};

export const loginRestaurant = ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    return request
        .post(process.env.NEXT_PUBLIC_BASEURL + "/restaurant/login", {
            email,
            password,
        })
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }) as Promise<AuthResponse>;
};
