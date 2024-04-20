import {NavBarRoute} from "@/components/layout/NavBar/NavBar";

export const API_URL = 'http://localhost:5005/';
export const LOCAL_STORAGE_TOKEN_KEY = 'accessToken';
export const LOCAL_STORAGE_REFRESH_TOKEN_KEY ='refreshToken';

export const NAVBAR_ROUTES: NavBarRoute[]= [
    { path: "/courses", title: "Все курсы"},
    { path: "/", title: "Консультации"},
    { path: "/", title: "Достижения"},
]