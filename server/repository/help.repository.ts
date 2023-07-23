import HelpCall, { HelpCallStatus } from "../models/HelpCall";

// Creates a call for help/assistance
export const createHelpCall = async (
  restaurantId: number,
  tableId: number,
  status: HelpCallStatus,
  device: string | null,
  placedOn: string
) => {
  const newHelpCall = await HelpCall.query().insert({
    restaurantId,
    tableId,
    placedOn,
    status,
    device,
  });
  return HelpCall.query().findOne({ id: newHelpCall.id });
};

// Change request status given orderId
export const updateHelpCallStatus = async (
  helpCallId: number,
  newStatus: HelpCallStatus
) => {
  await HelpCall.query()
    .patch({
      status: newStatus,
    })
    .where({ id: helpCallId });

  return HelpCall.query().findOne({ id: helpCallId });
};

// Find help request with id
export const getHelpCallById = async (helpCallId: number) => {
  return HelpCall.query().findOne({
    id: helpCallId,
  });
};

// Delete a help request with specific id
export const deleteHelpCall = (helpCallId: number) => {
  return HelpCall.query().where("id", helpCallId).del();
};

// Get all requests regardless of status
export const getAllHelpCalls = async (restaurantId: number) => {
  return HelpCall.query()
    .where({
      restaurantId,
    })
    .orderBy("HelpCall.placedOn");
};

// Get all requests that are incomplete
export const getUnresolvedHelpCalls = async (restaurantId: number) => {
  return HelpCall.query()
    .where({
      restaurantId,
      status: "unresolved",
    })
    .orderBy("HelpCall.placedOn");
};
