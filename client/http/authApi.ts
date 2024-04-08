import axios from "axios";
import {API_URL} from "@/constants";
import {localStorageService} from "@/services/localStorageService";


const $authApi = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$authApi.interceptors.request.use((config) => {
    // Проверяем, что запрос не является запросом на обновление токена, чтобы избежать бесконечной рекурсии
    const accessToken = localStorageService.getAccessToken()
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

$authApi.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.post(`${API_URL}auth/refresh`, null, {
                headers: {
                    Authorization: `Bearer ${localStorageService.getRefreshToken()}`
                }
            });
            localStorageService.setAccessToken(response.data.accessToken)
            localStorageService.setRefreshToken(response.data.refreshToken)
            return $authApi.request(originalRequest);
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error;
})

export default $authApi;