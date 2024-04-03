// ==============================================
const networkErrorCodeMessages = {
    400: "The information sent to the server is incorrect. Please double check all form values.",
    401: "Please login again to proceed.",
    404: "The resource you are looking for could not be located. We're sorry for the inconveniences caused.",
    422: "You have exceeded the quota set for this request. Please contact administrators on how to best work around this.",
    500: "Something went wrong with the communications from the server. Please try again."
};

const networkErrorCodes = {
    400: "bad-form-request",
    401: "unauthorized-access",
    404: "resource-missing",
    422: "too-many-requests",
    500: "server-error"
};

const errorNoAuthEventName = "onUnauthorizedAccess";
const  errorServerEventName = "onServerError";
// ==============================================
export {
    networkErrorCodeMessages, networkErrorCodes,
    errorNoAuthEventName, errorServerEventName
};
// ==============================================