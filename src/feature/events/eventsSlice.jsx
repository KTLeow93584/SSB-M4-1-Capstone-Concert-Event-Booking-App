import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { callServerAPI } from '../../apis/authApi.jsx';

// Async thunk for fetching events as a user.
export const fetchEventsUser = createAsyncThunk(
    "events/fetch/user",
    async (params, api) => {
        const result = await callServerAPI('events/user', "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for fetching events as an admin.
export const fetchEventsAdmin = createAsyncThunk(
    "events/fetch/admin",
    async (params, api) => {
        const result = await callServerAPI(`events/admin`, "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for fetching a specific user's event as an admin.
export const fetchUserEventAdmin = createAsyncThunk(
    "event/user/fetch/admin",
    async (params, api) => {
        const result = await callServerAPI(`event/${params.user_id}/admin`, "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for creating a new event.
export const createANewEvent = createAsyncThunk(
    "event/create",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            event_venue_id: params.event.venue_id,
            event_name: params.event.name,
            event_scheduled_start: params.event.start_time,
            event_scheduled_end: params.event.end_time,
            event_promo_image: params.event.promotional_image,
            event_remarks: params.event.remarks
        };
        const result = await callServerAPI("event", "POST", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for modifying an existing event.
export const updateEvent = createAsyncThunk(
    "event/modify",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            event_id: params.event.event_id,
            event_venue_id: params.event.venue_id,
            event_name: params.event.name,
            event_scheduled_start: params.event.start_time,
            event_scheduled_end: params.event.end_time,
            event_promo_image: params.event.promotional_image,
            event_remarks: params.event.remarks
        };

        const result = await callServerAPI("event", "PUT", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for deleting an existing event.
export const deleteEvent = createAsyncThunk(
    "event/delete",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            event_id: params.event_id
        };

        const result = await callServerAPI("event", "DELETE", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Slice
const eventsSlice = createSlice({
    name: "events",
    initialState: { events: [] },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all events as a user.
        builder.addCase(fetchEventsUser.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Fetch Events As A User] Payload.", action.payload);

            state.events = action.payload.client_data.events;
        });

        // Fetch all events as an admin.
        builder.addCase(fetchEventsAdmin.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Fetch Events As An Admin] Payload.", action.payload);

            state.events = action.payload.client_data.events;
        });

        // Fetch a specific event as an admin.
        builder.addCase(fetchUserEventAdmin.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Fetch a user's event as an admin] Payload.", action.payload);
        });

        // Creating a new event.
        builder.addCase(createANewEvent.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            console.log("[Create a New Event] Payload.", action.payload);

            state.events.unshift(action.payload.client_data.event);
        });

        // Updating an existing event.
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Modify an Existing Event] Payload.", action.payload);

            const eventIndex = state.events.findIndex((event) => event.event_id === action.payload.client_data.event.event_id);

            const newEvent = state.events[eventIndex];
            //newEvent.post_content = action.payload.client_data.post.post_content;

            state.events[eventIndex] = newEvent;
        });

        // Deleting an existing event.
        builder.addCase(deleteEvent.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Delete an Existing Event] Payload.", action.payload);

            const eventIndex = state.events.findIndex((event) => event.event_id === action.payload.client_data.event.event_id);

            state.events.splice(eventIndex, 1);
        });
    }
});

export default eventsSlice.reducer;