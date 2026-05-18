import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { defaultUser, initialState, User } from './identityState';
import { Status } from '../../common/interfaces/Fetch';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

// Async thunk for logout
export const logoutUser = createAsyncThunk(
    'identity/logout',
    async () => {
        await signOut(auth);
    }
);

const identitySlice = createSlice({
    name: 'identity',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.needsOnboarding = false;
            state.user = defaultUser;
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user.id = action.payload?.id || "BROKEN";
            state.user.email = action.payload?.email || "BROKEN";
            state.isAuthenticated = true;
            state.needsOnboarding = action.payload?.needsOnboarding || false;
            state.status = Status.Initialised;
        },
        setOnboardingComplete: (state) => {
            state.needsOnboarding = false;
        },
    },
});

export const { logout, setUser, setOnboardingComplete } = identitySlice.actions;
export default identitySlice.reducer;