import NotFound from "../errors/NotFound";
import { HelpCallStatus } from "../models/HelpCall";
import * as helpRepo from "../repository/help.repository";
import * as restaurantRepo from "../repository/restaurant.repository";

export const createHelpCall = async (
  restaurantId: number,
  tableId: number,
  status: HelpCallStatus,
  device: string | null,
  placedOn: string
) => {
  return helpRepo.createHelpCall(
    restaurantId,
    tableId,
    status,
    device,
    placedOn
  );
};

export const updateHelpCallStatus = async (
  restaurantId: number,
  helpCallId: number,
  newStatus: HelpCallStatus
) => {
  const helpCall = await helpRepo.getHelpCallById(helpCallId);
  if (helpCall?.restaurantId !== restaurantId) {
    throw new NotFound("This assistance request does not exist...");
  }
  return helpRepo.updateHelpCallStatus(helpCallId, newStatus);
};

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

export const getAllUnresolvedHelpCalls = async (restaurantId: number) => {
  const restaurant = await restaurantRepo.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new NotFound("Restaurant does not exist.");
  }
  return helpRepo.getUnresolvedHelpCalls(restaurantId);
};
