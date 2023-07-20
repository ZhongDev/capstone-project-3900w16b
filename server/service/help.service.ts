import NotFound from "../errors/NotFound";
import * as helpRepo from "../repository/help.repository";

export const createHelpRequest = async (
    restaurantId: number,
    tableId: number,
    status: "complete" | "incomplete",
    device: string | null,
    placedOn: String,
) => {
    return helpRepo.createHelpRequest(restaurantId, tableId, status, device, placedOn);
};

export const changeHelpRequestStatus = async (
    restaurantId: number,
    helpRequestId: number,
    newStatus: "complete" | "incomplete",
) => {
    const helpRequest = await helpRepo.getHelpRequestById(helpRequestId);
    if (helpRequest?.restaurantId !== restaurantId) {
        throw new NotFound("This assistance request does not exist...");
      }
      return helpRepo.changeHelpRequestStatus(helpRequestId, newStatus); 
}

export const getAllHelpRequests = async (restaurantId: number) => {
    return;
}