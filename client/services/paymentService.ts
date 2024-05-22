import $authApi from "@/http/authApi";

export class PaymentService {
    public static async handlePayment(userId: string, courseId: string, tariffId: string, amount: number){
        try{
            const response = await $authApi.post('/payments/create', {
                userId,
                courseId,
                tariffId,
                amount
            });
            return response.data
        }catch (e) {
            throw e
        }
    }
}