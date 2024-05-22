import $authApi from "@/http/authApi";

export class ShopService {
    static async getItems() {
        try {
            const response = await $authApi.get('/shop/items');
            return response.data;
        } catch (error) {
            console.error('Error getting shop items:', error);
            throw error;
        }
    }

    static async purchaseItem(userId: string, itemId: string) {
        try {
            const response = await $authApi.post('/shop/purchase', { userId, itemId });
            return response.data;
        } catch (error) {
            console.error('Error purchasing item:', error);
            throw error;
        }
    }
}
