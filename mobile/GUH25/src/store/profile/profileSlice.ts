import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status } from "../../common/interfaces/Fetch";
import { initialState } from "./profileState";
import { getCountries, getProfile } from "../../apiServices/profile/ProfileApiService";

const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (userId: string) => {
        const response = await getProfile(userId);
        console.log('Fetched profile data:', response);
        return response;
    }
);

const fetchCountries = createAsyncThunk(
    'profile/fetchCountries',
    async (userId: string) => {
        const response = await getCountries(userId);
        console.log('Fetched countries data:', response);
        return response;
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.username = '';
            state.status = Status.Idle;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = Status.Initialising;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = Status.Initialised;
                state.username = action.payload.username;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = Status.Initialised;
            })

            .addCase(fetchCountries.pending, (state) => {
                state.status = Status.Initialising;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.status = Status.Initialised;
                const countries: string[] = []
                const images: string[] = [];

                if (action.payload.images && Array.isArray(action.payload.images)) {
                    action.payload.images.forEach((item: any) => {
                        // Only add if not already in the array (prevent duplicates)
                        if (item.country && !countries.includes(item.country)) {
                            countries.push(item.country);
                        }
                        if (item.imageUrl && !images.includes(item.imageUrl)) {
                            images.push(item.imageUrl);
                        }
                    });
                }

                state.countries = countries;
                state.images = images;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.status = Status.Idle;
            });
    },
});

export default profileSlice.reducer;
export const { clearProfile } = profileSlice.actions;
export { fetchProfile, fetchCountries };