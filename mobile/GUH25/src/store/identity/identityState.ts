import { Fetch, Status } from "../../common/interfaces/Fetch";

export interface User {
    id: string;
    email: string;
}

export const defaultUser: User = {
    id: '',
    email: '',
};

export interface AuthState extends Fetch {
    isAuthenticated: boolean;
    needsOnboarding: boolean;
    user: User;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    needsOnboarding: false,
    user: defaultUser,
    status: Status.Idle
};