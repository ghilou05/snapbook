import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchProfile } from "./profileSlice";

interface IProps {
    children: React.ReactNode;
}

export default function ProfileProvider({ children }: IProps) {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.auth.user.id);

    useEffect(() => {
        dispatch(fetchProfile(userId));
    }, [dispatch, userId]);

    return <>{children}</>;
}