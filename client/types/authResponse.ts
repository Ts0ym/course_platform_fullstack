import {IUser} from "@/types/UsersTypes";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}