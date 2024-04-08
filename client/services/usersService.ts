import $authApi from "@/http/authApi";
import {IUser} from "@/types";

export class UsersService {
    public static async getAllUsers(): Promise<IUser[]> {
        const response = await $authApi.get("/users");
        return response.data;
    }
}