import { Fetch, Status } from "../../common/interfaces/Fetch";

export interface ProfileState extends Fetch {
    username: string;
    countries: string[];
    images: string[];
}

export const initialState: ProfileState = {
    username: '',
    status: Status.Idle,
    countries: [],
    images: [],
};