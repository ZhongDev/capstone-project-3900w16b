import { UniqueViolationError } from "objection";
import BadRequest from "../errors/BadRequest";
import Forbidden from "../errors/Forbidden";
import * as restaurantRepo from "../repository/restaurant.repository";
import bcrypt from "bcrypt";

export const createRestaurant = async (
    email: string,
    name: string,
    password: string
) => {
    try {
        const hash = await promiseHash(password);
        return await restaurantRepo.createRestaurant(email, name, hash);
    } catch (err) {
        if (err instanceof UniqueViolationError) {
            throw new BadRequest("Email already exists");
        }
        throw err;
    }
};

export const createRestaurantTable = async (restaurantId: number) => {
    return restaurantRepo.createRestaurantTable(restaurantId);
};

export const deleteRestaurantTable = async (tableId: number) => {
    return restaurantRepo.deleteRestaurantTable(tableId);
};

export const login = async (email: string, password: string) => {
    const restaurant = await restaurantRepo.getRestaurantByEmail(email);
    if (!restaurant) {
        throw new Forbidden("Invalid credentials");
    }
    const passwordMatches = await promiseHashCompare(
        password,
        restaurant.password
    );

    if (!passwordMatches) {
        throw new Forbidden("Invalid credentials");
    }

    return restaurant;
};

const promiseHashCompare = (
    enteredPassword: string,
    password: string
): Promise<boolean> =>
    new Promise((resolve, reject) => {
        bcrypt.compare(enteredPassword, password, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });

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
