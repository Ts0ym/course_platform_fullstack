import axios from "axios";
import {AuthResponse} from "@/types/authResponse";
import $authApi from "@/http/authApi";
import {localStorageService} from "@/services/localStorageService";
import {API_URL} from "@/constants";

export class AuthService {
    public static async login(email: string, password: string) {
        const response = await $authApi.post<AuthResponse>("/auth/login", {
            email,
            password
        })
        localStorageService.setAccessToken(response.data.accessToken)
        localStorageService.setRefreshToken(response.data.refreshToken)
        return response
    }

    public static async register(email: string, password: string, name: string, surname: string) {
        const response = await $authApi.post<AuthResponse>(
            "/auth/register",
            {email, password, name, surname})
        localStorageService.setAccessToken(response.data.accessToken)
        localStorageService.setRefreshToken(response.data.refreshToken)
        return response
    }

    public static async logout() {
        try{
            const response = await $authApi.post("/auth/logout");
            localStorageService.removeAccessToken()
            localStorageService.removeRefreshToken()
            return response
        }catch (e) {
            return e
        }
    }

    public static async checkAuth(){

            const response = await axios.post(`${API_URL}auth/refresh`, null, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorageService.getRefreshToken()}`
                }
            });
            localStorageService.setAccessToken(response.data.accessToken)
            localStorageService.setRefreshToken(response.data.refreshToken)
            return response.data
    }
}