import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {PaymentsService} from "./payments.service";

@Controller('payments')
export class PaymentsController {

    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('create')
    async createPayment(@Body() dto: {userId: string, courseId: string, tariffId: string, amount: number}): Promise<any> {
        return await this.paymentsService.createPayment(dto);
    }

    @Post('webhook')
    @HttpCode(HttpStatus.OK) // Часто для вебхуков используется статус 200, чтобы подтвердить успешное получение.
    async handleWebhook(@Body() data: any): Promise<any> {
        return await this.paymentsService.handleWebhook(data);
    }
}
