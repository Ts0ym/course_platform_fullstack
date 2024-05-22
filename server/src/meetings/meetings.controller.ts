import {Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res} from '@nestjs/common';
import {MeetingsService} from "./meetings.service";

@Controller('meetings')
export class MeetingsController {

    constructor(private readonly meetingsService: MeetingsService) {}
    @Post('webhook')
    async handleWebhook(@Body() body: any): Promise<any> {

        const eventType = body.event; // Предполагаем, что Calendly отправляет тип события в этом поле
        // console.log(body);
        console.log(body)
        switch (eventType) {
            case 'invitee.created':
                await this.meetingsService.create(body);
                return { message: 'Meeting scheduled successfully' };

            case 'invitee.canceled':
                // Предполагается, что URI приглашенного передается в том же формате
                await this.meetingsService.remove(body.payload.uri);
                return { message: 'Meeting canceled successfully' };

            default:
                return { message: 'Event type not handled' };
        }
    }

    @Get()
    async findAllByEmail(@Query('email') email: string): Promise<any> {
        try {
            const meetings = await this.meetingsService.findAllByEmail(email);
            if (!meetings || meetings.length === 0) {
                throw new HttpException('No meetings found for this email', HttpStatus.NOT_FOUND);
            }
            return meetings;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
