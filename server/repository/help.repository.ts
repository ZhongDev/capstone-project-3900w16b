import HelpRequest from "../models/HelpRequest";


export const createHelpRequest = async (
    restaurantId: number,
    tableId: number,
    status: "complete" | "incomplete",
    device: string | null,
    placedOn: String,
) => {
    const newHelpRequest = await HelpRequest.query().insert({
        restaurantId,
        tableId,
        placedOn,
        status,
        device,
    })
    return HelpRequest.query().findOne({id: newHelpRequest.id});
};

// Change request status given orderId 
export const changeHelpRequestStatus = async (
    helpRequestId: number,
    newStatus: "complete" | "incomplete",
) => {
    await HelpRequest.query()
    .patch({
      status: newStatus,
    })
    .where({ id: helpRequestId });

    return HelpRequest.query().findOne({ id: helpRequestId });
};

export const getHelpRequestById = async (helpRequestId: number) => {
    return HelpRequest.query().findOne({
        id: helpRequestId,
    })
}


// Get all requests regardless of status
export const getAllHelpRequests = async (
    restaurantId: number,
) => {
    return HelpRequest.query()
    .where({
        restaurantId,
    }).orderBy("HelpRequest.placedOn")
}

// Get all requests that are incomplete
export const getIncompleteHelpRequests = async (
    restaurantId: number,
) => {
    return HelpRequest.query()
    .where({
        restaurantId,
        status: "incomplete",
    }).orderBy("HelpRequest.placedOn")
}