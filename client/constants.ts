import {NavBarRoute} from "@/components/layout/NavBar/NavBar";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const API_IMAGES_DOMAIN = process.env.API_IMAGES_DOMAIN;
// export const API_IMAGES_PORT = process.env.API_IMAGES_PORT;
export const LOCAL_STORAGE_TOKEN_KEY = 'accessToken';
export const LOCAL_STORAGE_REFRESH_TOKEN_KEY ='refreshToken';

export const NAVBAR_ROUTES: NavBarRoute[]= [
    { path: "/courses", title: "Каталог курсов"},
    { path: "/mycourses", title: "Мои курсы"},
    { path: "/consultations", title: "Консультации"},
]