import $authApi from "@/http/authApi";
import {IUser, UpdateUserDto} from "@/types";

export class UsersService {
    public static async getAllUsers(): Promise<IUser[]> {
        const response = await $authApi.get("/users");
        return response.data;
    }

    static async getUserById(userId: string) {
        try {
            const response = await $authApi.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error retrieving user:', error);
            throw error;
        }
    }

    static async updateUser(userId: string, userData: any) {
        try {
            const formData = new FormData();
            Object.keys(userData).forEach(key => {
                if (key === 'avatar' && userData[key] instanceof File) {
                    formData.append('avatar', userData[key], userData[key].name);
                } else {
                    formData.append(key, userData[key]);
                }
            });

            const response = await $authApi.patch(`/users/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async getFullUserInfo(userId: string) {
        try {
            const response = await $authApi.get(`/users/fulldata/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error retrieving user info:', error);
            throw error;
        }
    }

    static async enrollUser(dto: {userId: string
        courseId: string, tariffId: string}) {
        try {
            const response = await $authApi.post('/courses/enroll', dto);
            return response.data;
        } catch (error) {
            console.error('Error enrolling user:', error);
            throw error;
        }
    }
}