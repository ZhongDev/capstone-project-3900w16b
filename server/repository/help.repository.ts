import HelpRequest from "../models/HelpRequest";


export const createHelpRequest = async (
    restaurantId: number,
    tableId: number,
    status: "resolved" | "unresolved",
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
    newStatus: "resolved" | "unresolved",
) => {
    await HelpRequest.query()
    .patch({
      status: newStatus,
    })
    .where({ id: helpRequestId });

    return HelpRequest.query().findOne({ id: helpRequestId });
};


// Find help request with id
export const getHelpRequestById = async (helpRequestId: number) => {
    return HelpRequest.query().findOne({
        id: helpRequestId,
    })
}


// Delete a help request with specific id
export const deleteHelpRequest = (helpRequestId: number) => {
    return HelpRequest.query().where("id", helpRequestId).del()
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
        status: "unresolved",
    }).orderBy("HelpRequest.placedOn")
}