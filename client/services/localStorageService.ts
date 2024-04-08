import {LOCAL_STORAGE_REFRESH_TOKEN_KEY, LOCAL_STORAGE_TOKEN_KEY} from "@/constants";

export class localStorageService {
    public static setAccessToken( accessToken:string ){
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, accessToken);
    }

    public static getAccessToken(){
        return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    }

    public static removeAccessToken(){
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    }

    public static setRefreshToken( refreshToken: string ){
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
    }

    public static getRefreshToken(){
        return localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    }

    public static removeRefreshToken(){
        localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    }
}