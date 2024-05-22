import $authApi from "@/http/authApi";

export class AchievementService {
    public static async createAchievement(createAchievementDTO: FormData) {
        try {
            const response = await $authApi.post('/achievements', createAchievementDTO);
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error creating achievement:', error);
            throw error;
        }
    }

    public static async getAllAchievements() {
        try {
            const response = await $authApi.get('/achievements');
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error getting all achievements:', error);
            throw error;
        }
    }

    public static async getAchievementById(id: string) {
        try {
            const response = await $authApi.get(`/achievements/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error getting achievement by id (${id}):`, error);
            throw error;
        }
    }

    public static async updateAchievement(id: string, updateAchievementDTO: FormData) {
        try {
            const response = await $authApi.patch(`/achievements/${id}`, updateAchievementDTO);
            console.log(response);
            return response.data;
        } catch (error) {
            console.error(`Error updating achievement by id (${id}):`, error);
            throw error;
        }
    }

    public static async deleteAchievement(id: string) {
        try {
            const response = await $authApi.delete(`/achievements/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting achievement by id (${id}):`, error);
            throw error;
        }
    }

    static async checkAchievements(userId: string) {
        try {
            const response = await $authApi.get(`/users/${userId}/check-achievements`);
            return response.data;
        } catch (error) {
            console.error('Error checking achievements:', error);
            throw error;
        }
    }

    static async getUserAchievements(userId: string) {
        try {
            const response = await $authApi.get(`/users/${userId}/achievements`);
            return response.data;
        } catch (error) {
            console.error('Error getting user achievements:', error);
            throw error;
        }
    }
}