import {IUser} from "@/redux/slices/authSlice";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}