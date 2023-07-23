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

export const createOrder = (restaurantId: number, tableId: number) =>
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

export const updateHelpCallStatus = (
  helpCallId: number,
  newStatus: HelpCallStatus
) => {
  return request
    .patch(process.env.NEXT_PUBLIC_BASEURL + "/help/" + helpCallId, newStatus)
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

// for getting all unresolved help calls
export type GetUnresolvedHelpCallsResponse = {
  restaurant: { name: string; id: number };
  helpCalls: helpCall[];
};

export type helpCall = {
  id: number;
  tableId: number;
  status: HelpCallStatus;
  placedOn: string;
};

export const getUnresolvedHelpCalls = () => {
  return request
    .get(process.env.NEXT_PUBLIC_BASEURL + "/help")
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    }) as Promise<GetUnresolvedHelpCallsResponse>;
};
