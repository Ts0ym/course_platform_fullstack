import { Injectable } from '@nestjs/common';
import * as YooKassa from "yookassa"
import {Model, Types} from "mongoose";
import {Payment, PaymentDocument} from "./ payment.schema";
import {InjectModel} from "@nestjs/mongoose";
import {CoursesService} from "../courses/courses.service";

const yooKassa = new YooKassa({
    shopId: "384574",
    secretKey: "test_FDvM59OIzPRtvGmBdZo-c_8P4fJs7zIwyaVpajVwPCs"
})
@Injectable()
export class PaymentsService {
    constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
                private readonly coursesService: CoursesService
    ) {}
    async createPayment(dto: {userId: string, courseId: string, tariffId: string, amount: number}) {
        const paymentData = await yooKassa.createPayment({
            amount: {
                value: dto.amount,
                currency: "RUB"
            },
            confirmation: {
                type: "redirect",
                return_url: "https://your-return-url.com"
            },
            capture: true,
            description: "Оплата тарифа курса"
        });

        // Создание записи платежа в базе данных
        const payment = new this.paymentModel({
            userId: dto.userId,
            courseId: dto.courseId,
            tariffId: dto.tariffId,
            amount: dto.amount,
            status: 'pending',
            paymentId: paymentData.id
        });
        await payment.save();

        return paymentData;
    }

    async handleWebhook(data: any): Promise<any> {
        // console.log(data)

        if (data.event === 'payment.succeeded') {
            try{
                const id = data.object.id
                console.log(id)
                const payment = await this.paymentModel.findOne({ paymentId: data.object.id });
                if (payment && payment.status !== 'succeeded') {
                    await this.updatePaymentStatus(payment._id, 'succeeded');
                    await this.coursesService.enrollUser(
                        {
                            userId: payment.userId.toString(),
                            courseId: payment.courseId.toString(),
                            tariffId: payment.tariffId.toString(),
                        })
                }
            }catch (e) {
                console.log(e)
            }
        }
        return { received: true };
    }

    private async updatePaymentStatus(paymentId: Types.ObjectId, status: string): Promise<void> {
        await this.paymentModel.findByIdAndUpdate(paymentId, { status: status });
    }
}
