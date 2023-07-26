import NotFound from "../errors/NotFound";
import { HelpCallStatus } from "../models/HelpCall";
import * as helpRepo from "../repository/help.repository";
import * as restaurantRepo from "../repository/restaurant.repository";

// create help call
export const createHelpCall = async (
  restaurantId: number,
  tableId: number,
  status: HelpCallStatus,
  placedOn: string
) => {
  return helpRepo.createHelpCall(restaurantId, tableId, status, placedOn);
};

// update help call status to desired status
export const updateHelpCallStatus = async (
  helpCallId: number,
  restaurantId: number,
  tableId: number,
  newStatus: HelpCallStatus
) => {
  const helpCall = await helpRepo.getHelpCallById(helpCallId);
  if (helpCall?.restaurantId !== restaurantId) {
    throw new NotFound("This assistance request does not exist...");
  }
  return helpRepo.updateHelpCallStatusTable(tableId, newStatus);
};

// delete help call (if needed)
export const deleteHelpCall = async (
  restaurantId: number,
  helpCallId: number
) => {
  const helpCall = await helpRepo.getHelpCallById(helpCallId);
  if (helpCall?.restaurantId !== restaurantId) {
    throw new NotFound("This assistance request does not exist...");
  }
  return helpRepo.deleteHelpCall(helpCallId);
};

// get all unresolved help calls
export const getAllUnresolvedHelpCalls = async (restaurantId: number) => {
  const restaurant = await restaurantRepo.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new NotFound("Restaurant does not exist.");
  }
  return await helpRepo.getUnresolvedHelpCalls(restaurantId);
};
