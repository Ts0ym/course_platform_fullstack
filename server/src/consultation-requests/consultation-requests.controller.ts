import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {ConsultationRequestsService} from "./consultation-requests.service";
import {ConsultationRequest} from "./consultation-requests.schema";

@Controller('consultation-requests')
export class ConsultationRequestsController {
    constructor(private readonly consultationRequestsService: ConsultationRequestsService) {}
    @Patch(':id/approve')
    async approveRequest(
        @Param('id') requestId: string,
        @Body('startTime') startTime: Date,
        @Body('endTime') endTime: Date,
    ) {
        return this.consultationRequestsService.markRequestAsApproved(requestId, startTime, endTime);
    }

    @Post()
    async createConsultationRequest(@Body() createConsultationRequestDto: ConsultationRequest) {
        return this.consultationRequestsService.createConsultationRequest(
            createConsultationRequestDto
        );
    }

    @Get('pending')
    async getPendingRequests() {
        return this.consultationRequestsService.getPendingRequests();
    }

    @Get('approved')
    async getApprovedRequests() {
        return this.consultationRequestsService.getApprovedRequests();
    }

    @Get(':userId/approved')
    async getApprovedRequestsForUser(@Param('userId') userId: string) {
        return this.consultationRequestsService.getApprovedRequestsForUser(userId);
    }

// Метод контроллера для получения pending заявок для конкретного пользователя
    @Get(':userId/pending')
    async getPendingRequestsForUser(@Param('userId') userId: string) {
        return this.consultationRequestsService.getPendingRequestsForUser(userId);
    }

    @Get(':userId/all')
    async getAllRequestsForUser(@Param('userId') userId: string){
        return this.consultationRequestsService.getAllRequestsForUser(userId);
    }
}
