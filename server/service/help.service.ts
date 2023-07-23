import NotFound from "../errors/NotFound";
import HelpRequest from "../models/HelpRequest";
import * as helpRepo from "../repository/help.repository";
import * as restaurantRepo from "../repository/restaurant.repository";

export const createHelpRequest = async (
    restaurantId: number,
    tableId: number,
    status: "resolved" | "unresolved",
    device: string | null,
    placedOn: String,
) => {
    return helpRepo.createHelpRequest(restaurantId, tableId, status, device, placedOn);
};

export const changeHelpRequestStatus = async (
    restaurantId: number,
    helpRequestId: number,
    newStatus: "resolved" | "unresolved",
) => {
    const helpRequest = await helpRepo.getHelpRequestById(helpRequestId);
    if (helpRequest?.restaurantId !== restaurantId) {
        throw new NotFound("This assistance request does not exist...");
    }
      return helpRepo.changeHelpRequestStatus(helpRequestId, newStatus); 
};

export const deleteHelpRequest = async (
    restaurantId: number,
    helpRequestId: number) => {
    const helpRequest = await helpRepo.getHelpRequestById(helpRequestId);
    if (helpRequest?.restaurantId !== restaurantId) {
        throw new NotFound("This assistance request does not exist...");
    }
    return helpRepo.deleteHelpRequest(helpRequestId);
}

export const getAllHelpRequests = async (restaurantId: number) => {
    const restaurant = await restaurantRepo.getRestaurantById(restaurantId);
    if (!restaurant) {
        throw new NotFound("Restaurant does not exist.");
    }
    return helpRepo.getAllHelpRequests(restaurantId);
}

