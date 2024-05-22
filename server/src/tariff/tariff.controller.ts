import {Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post} from '@nestjs/common';
import {TariffService} from "./tariff.service";
import {CreateTariffDto, UpdateTariffDto} from "./tariff.dto";

@Controller('tariffs')
export class TariffController {
    constructor(private readonly tariffsService: TariffService) {}

    @Post()
    async createTariff(@Body() createTariffDto: CreateTariffDto) {
        const tariff = await this.tariffsService.createTariff(createTariffDto);
        return tariff;
    }

    @Get(':tariffId')
    async getTariffById(@Param('tariffId') tariffId: string) {
        const tariff = await this.tariffsService.findTariffById(tariffId);
        if (!tariff) {
            throw new HttpException('Tariff not found', HttpStatus.NOT_FOUND);
        }
        return tariff;
    }

    @Get('/course/:courseId')
    async getTariffsByCourse(@Param('courseId') courseId: string) {
        const tariffs = await this.tariffsService.findTariffsByCourse(courseId);
        return tariffs;
    }

    @Patch(':tariffId')
    async updateTariff(@Param('tariffId') tariffId: string, @Body() updateTariffDto: UpdateTariffDto) {
        const updatedTariff = await this.tariffsService.updateTariff(tariffId, updateTariffDto);
        if (!updatedTariff) {
            throw new HttpException('Tariff not found', HttpStatus.NOT_FOUND);
        }
        return updatedTariff;
    }

    @Delete(':tariffId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTariff(@Param('tariffId') tariffId: string) {
        const deletedTariff = await this.tariffsService.deleteTariff(tariffId);
        if (!deletedTariff) {
            throw new HttpException('Tariff not found', HttpStatus.NOT_FOUND);
        }
        return deletedTariff;
    }
}