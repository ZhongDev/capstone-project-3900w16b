import NotFound from "../errors/NotFound";
import { HelpCallStatus } from "../models/HelpCall";
import { manageTableHelpCall } from "../types/help";
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
export const updateHelpCallStatusTable = async (
  restaurantId: number,
  tableId: number,
  newStatus: HelpCallStatus
) => {
  const table = await restaurantRepo.getRestaurantTableById(tableId);
  if (table?.restaurantId !== restaurantId) {
    throw new NotFound(
      "This request's table isn't in the correct restaurant..."
    );
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
  // TODO: stop running n^2 stuff on load and just make a numOccurances in Help
  const helpManage: manageTableHelpCall[] = [];
  const helpData = await helpRepo.getUnresolvedHelpCalls(restaurantId);
  helpData?.map((val, index, self) => {
    if (self.findIndex((v) => v.tableId === val.tableId) === index) {
      helpManage?.push({
        tableId: val.tableId,
        numOccurrence: 1,
      });
    } else {
      helpManage[
        helpManage.findIndex((v) => v.tableId === val.tableId)
      ].numOccurrence += 1;
    }
  });

  return helpManage;
};
