import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callServerAPI } from '../../apis/apiAxiosFetch.jsx';

// Async thunk for login.
export const login = createAsyncThunk(
    "login",
    async (params, api) => {
        const data = {
            email: params.email,
            password: params.password ? params.password : null,
            social_provider: params.social_provider ? params.social_provider : null,
            social_uid: params.social_uid,
            social_access_token: params.social_access_token ? params.social_access_token : null,
            social_refresh_token: params.social_refresh_token ? params.social_refresh_token : null
        };

        const result = await callServerAPI("login", "POST", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for logout.
export const logout = createAsyncThunk(
    "logout",
    async (params, api) => {
        const result = await callServerAPI("logout", "POST", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for registration.
export const register = createAsyncThunk(
    "register",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            email: params.email,
            country_id: params.country_id,
            contact_number: params.contact_number,
            password: params.password,
            social_provider: params.social_provider,
            social_uid: params.social_uid,

            // Individuals
            name: params.name,
            nric: params.nric,

            // Organizations/Companies
            organization_name: params.organization_name,
            organization_registration_number: params.organization_registration_number
        };
        const result = await callServerAPI("register", "POST", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for acquiring user info from server.
export const getUserInfo = createAsyncThunk(
    "user/get",
    async (params, api) => {
        const result = await callServerAPI("profile", "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for updating user info.
export const updateUserInfo = createAsyncThunk(
    "user/update",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            name: params.name,
            country_id: params.country_id,
            contact_number: params.contact_number,
            profile_picture: params.profile_picture
        };
        const result = await callServerAPI("profile", "PUT", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Slice
const activeUserSlice = createSlice({
    name: "activeUser",
    initialState: { user: null },
    reducers: {
        updateActiveUser: (state, action) => {
            // Debug
            //console.log("[On Update Active User] Payload.", action.payload);

            return { user: action.payload.client_data.user };
        }
    },
    extraReducers: (builder) => {
        // Fetch Posts By User
        builder.addCase(login.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[On Login] Payload.", action.payload);

            return { user: action.payload.client_data.user };
        });

        builder.addCase(logout.fulfilled, (state, action) => {
            // Debug
            //console.log("[On Logout] Payload.", action.payload);

            if (!action.payload.success)
                return state;

            return { user: null };
        });

        builder.addCase(getUserInfo.fulfilled, (state, action) => {
            // Debug
            //console.log("[On Get User Profile] Payload.", action.payload);

            return { user: action.payload.client_data.user };
        });

        builder.addCase(updateUserInfo.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[On Update User Profile] Payload.", action.payload);

            return {
                user: {
                    user_id: state.user.user_id,
                    name: action.payload.client_data.user.name,
                    profile_picture: action.payload.client_data.user.profile_picture
                }
            };
        });
    }
});

export const { updateFollowingCount, updateActiveUser } = activeUserSlice.actions;
export default activeUserSlice.reducer;