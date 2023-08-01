import request from "./request";

export type HelpCallStatus = "resolved" | "unresolved";

// for creation of help call
export type CreateHelpCallResponse = {
  restaurantId: number;
  tableId: number;
  status: HelpCallStatus;
  placedOn: string;
  id: number;
};

export const createHelpCall = (restaurantId: number, tableId: number) =>
  request
    .post(`${process.env.NEXT_PUBLIC_BASEURL}/help/${restaurantId}/${tableId}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<CreateHelpCallResponse>;

// For updating status
export type UpdateHelpCallResponse = {
  helpCallId: number;
  newStatus: string;
};

export const updateHelpCallStatusTable = (
  tableId: number | undefined,
  newStatus: HelpCallStatus
) => {
  return request
    .patch(process.env.NEXT_PUBLIC_BASEURL + "/help/" + tableId, {
      newStatus,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<UpdateHelpCallResponse>;
};

// For deleting help calls
export const deleteHelpCall = (helpCallId: number) => {
  return request
    .delete(process.env.NEXT_PUBLIC_BASEURL + "/help/" + helpCallId)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<void>;
};

export type tableHelpCall = {
  tableId: number;
  numOccurrence: number;
};

export const getUnresolvedHelpCalls = () => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/help")
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<tableHelpCall[]>;
};