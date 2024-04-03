import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callServerAPI } from '../../apis/authApi.jsx';

// Async thunk for login.
export const login = createAsyncThunk(
    "login",
    async (params, api) => {
        const data = {
            email: params.email,
            password: params.password ? params.password : null,
            social_name: params.social_name ? params.social_name : null,
            social_provider: params.social_provider ? params.social_provider : null,
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

// Async thunk for updating user info.
export const updateUserInfo = createAsyncThunk(
    "user/update",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            first_name: params.first_name,
            last_name: params.last_name
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
            return {
                user: {
                    user_id: action.payload.client_data.user.user_id,
                    first_name: action.payload.client_data.user.first_name,
                    last_name: action.payload.client_data.user.last_name
                }
            };
        }
    },
    extraReducers: (builder) => {
        // Fetch Posts By User
        builder.addCase(login.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[On Login] Payload.", action.payload);

            return {
                user: {
                    user_id: action.payload.client_data.user.user_id,
                    first_name: action.payload.client_data.user.first_name,
                    last_name: action.payload.client_data.user.last_name
                }
            };
        });

        builder.addCase(logout.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[On Logout] Payload.", action.payload);

            return { user: null };
        });

        builder.addCase(updateUserInfo.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[On Update User Profile] Payload.", action.payload);

            return {
                user: {
                    user_id: state.user.user_id,
                    first_name: action.payload.client_data.user.first_name,
                    last_name: action.payload.client_data.user.last_name
                }
            };
        });
    }
});

export const { updateFollowingCount, updateActiveUser } = activeUserSlice.actions;
export default activeUserSlice.reducer;