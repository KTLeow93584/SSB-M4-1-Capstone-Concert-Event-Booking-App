// ====================================================================
import axios from "axios";

import { networkErrorCodeMessages, errorNoAuthEventName, errorServerEventName } from '../data/error-loggers.js';
import { onLoadingEnd } from '../data/loaders.js';
// ====================================================================
const inhouseServerMainURL = "https://4716e73d-e976-4758-a5c8-601b214fee20-00-2fjqcn2tg03g6.riker.replit.dev/";
// ====================================================================
const sessionTokenStorageName = "session-id-ror-event-host";
// ====================================================================
let sessionToken = null;

export function updateSessionToken(token) {
    sessionToken = token;
    localStorage.setItem(sessionTokenStorageName, token);
}

export function getSessionToken() {
    return sessionToken;
}
// ====================================================================
let sessionDeviceId = null;

export function updateDeviceID(id) {
    sessionDeviceId = id;

    // Debug
    //console.log("[Session Device ID] Set to:", id);
}
// ====================================================================
/**
 * @param string        subURL                     The API's name. (E.g. login, logout, register).
 * @param string        method                     Request Type (GET, POST, PUT, PATCH, DELETE).
 * @param string        body                       The JSON content of the request.
 * @param function      onSuccessfulCallback       Callback when API succeeded.
 * @param function      onFailedCallback           Callback when API failed.
 */
export async function callServerAPI(subURL, method = "GET", body = {},
    onSuccessfulCallback = null, onFailedCallback = null, onErrorCallback = null) {
    const fullURL = inhouseServerMainURL + subURL;

    // Debug
    //console.log("[On API Request] URL:", fullURL);

    try {
        let result = null;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "*/*",
            /*"User-Agent": "React.js Web",*/
            "Authorization": sessionToken ? ("Bearer " + sessionToken) : null,
            "Device": sessionDeviceId
        };

        // Debug
        //console.log("[On API Request] Header.", headers);
        //console.log("[On API Request] Body.", body);

        switch (method) {
            case "GET":
                result = await axios.get(fullURL, { headers });
                break;
            case "POST":
                result = await axios.post(fullURL, body ? body : {}, { headers });
                break;
            case "PUT":
                result = await axios.put(fullURL, body ? body : {}, { headers });
                break;
            case "PATCH":
                result = await axios.patch(fullURL, body ? body : {}, { headers });
                break;
            case "DELETE":
                result = await axios.delete(fullURL, { headers, data: body ? body : {} });
                break;
        }

        // Debug
        //console.log("[On API Request Successful] Result (" + fullURL + ").", result);

        const data = result.data;
        if (data.error) {
            const errorObj = data.error;

            // Debug
            //console.log("[On API Request Success w/ Error Messages] Error.", errorObj);

            if (onFailedCallback)
                onFailedCallback({
                    code: errorObj.code,
                    status: errorObj.status,
                    messages: networkErrorCodeMessages[errorObj.status] ?? "Undocumented Network Error."
                });

            if (errorObj.status === 401)
                window.dispatchEvent(new CustomEvent(errorNoAuthEventName));
            if (errorObj.status === 500)
                window.dispatchEvent(new CustomEvent(errorServerEventName));
        }
        else {
            const newAccessToken = data.access_token;
            if (newAccessToken) {
                //console.log("[On Received From Server] Update New Session Token 123.", newAccessToken);
                updateSessionToken(newAccessToken);
            }

            if (onSuccessfulCallback)
                onSuccessfulCallback(data.client_data ? data.client_data : null);
        }

        return data;
    }
    catch (error) {
        // Debug
        //console.log("[On API Request Failed] Error.", error);
        //console.log("[On API Request Failed] URL.", fullURL);

        onLoadingEnd("Global");

        if (onErrorCallback)
            onErrorCallback({
                code: error.code,
                status: error.request.status
            });

        window.dispatchEvent(new CustomEvent(errorServerEventName));
    }
}
// ====================================================================
/**
 * @param string        subURL                     The API's name. (E.g. login, logout, register).
 * @param string        method                     Request Type (GET, POST, PUT, PATCH, DELETE).
 * @param string        headers                    The Request Headers (E.g. Authorization, Content Type, etc.).
 * @param string        body                       The JSON content of the request.
 * @param function      onSuccessfulCallback       Callback when API succeeded.
 * @param function      onFailedCallback           Callback when API failed.
 */
export async function callTPServerAPI(url, method = "GET", headers = {}, body = {},
    onSuccessfulCallback = null, onFailedCallback = null) {
    // Debug
    //console.log("[On Third Party API Request] URL:", url);

    try {
        let result = null;

        // Debug
        //console.log("[On Third Party API Request] Header.", headers);
        //console.log("[On Third Party API Request] Body.", body);

        switch (method) {
            case "GET":
                result = await axios.get(url, { headers });
                break;
            case "POST":
                result = await axios.post(url, body ? body : {}, { headers });
                break;
            case "PUT":
                result = await axios.put(url, body ? body : {}, { headers });
                break;
            case "PATCH":
                result = await axios.patch(url, body ? body : {}, { headers });
                break;
            case "DELETE":
                result = await axios.delete(url, { headers, data: body ? body : {} });
                break;
        }

        // Debug
        //console.log("[On Third Party API Request Successful] Result.", result);

        const data = result.data;
        if (result.status === 200 || result.status === 201) {
            if (onSuccessfulCallback)
                onSuccessfulCallback(result.status === 201 ? null : data);
        }
        else {
            if (onFailedCallback)
                onFailedCallback({
                    code: result.code,
                    status: result.status,
                    message: result && result.data && result.data.message ? result.data.message : "N/A"
                });
        }

        return data;
    }
    catch (error) {
        // Debug
        console.log("[On Third Party API Request Failed] Error.", error);
    }
}
// ====================================================================
export { sessionTokenStorageName }