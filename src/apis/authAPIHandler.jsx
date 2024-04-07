import {
    FacebookAuthProvider, GoogleAuthProvider,
    signInWithPopup,
    getAuth
} from 'firebase/auth';
// ======================================================
export async function onGoogleAuthPrompt(onSuccessfulCallback = null, onFailedCallback = null) {
    try {
        const auth = getAuth();
        const res = await signInWithPopup(auth, new GoogleAuthProvider());

        // Debug
        //console.log("[On Google Login Successful] Result.", res);
        //console.log("[On Google Login Successful] Credentials from Result.", GoogleAuthProvider.credentialFromResult(res));

        if (onSuccessfulCallback)
            onSuccessfulCallback(res);
    }
    catch (error) {

        if (onFailedCallback)
            onFailedCallback(error.code);

        // Debug
        //console.error("[Google Login] Error.", error);
        //console.error("[Google Login] Error Object.", getErrorObject(error));
    }
}

export async function onFacebookAuthPrompt(onSuccessfulCallback = null, onFailedCallback = null) {
    try {
        const auth = getAuth();
        const res = await signInWithPopup(auth, new FacebookAuthProvider());

        // Debug
        //console.log("[On Facebook Login Successful] Result.", res);
        //console.log("[On Facebook Login Successful] Credentials from Result.", FacebookAuthProvider.credentialFromResult(res));

        if (onSuccessfulCallback)
            onSuccessfulCallback(res);
    }
    catch (error) {
        if (onFailedCallback)
            onFailedCallback(error.code);

        // Debug
        //console.error("[Google Login] Error.", error);
        //console.error("[Google Login] Error Object.", getErrorObject(error));
    }
}
// ======================================================
// Re-creates "error"" as a regular JS Object
function getErrorObject(error) {
    return Object.getOwnPropertyNames(error).reduce((acc, curr) => {
        acc[curr] = error[curr];
        return acc;
    }, {});
}
// ======================================================