import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Tariff} from "./tariff.schema";
import {Model} from "mongoose";
import {CreateTariffDto, UpdateTariffDto} from "./tariff.dto";
import {Course} from "../courses/courses.schema";

@Injectable()
export class TariffService {
    constructor(
        @InjectModel(Tariff.name) private readonly tariffModel: Model<Tariff>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>
    ) {}

    async createTariff(createTariffDto: CreateTariffDto): Promise<Tariff> {
        const newTariff = new this.tariffModel(createTariffDto);
        await newTariff.save(); // Сохраняем новый тариф

        // Добавляем ID нового тарифа в массив тарифов курса
        await this.courseModel.findByIdAndUpdate(
            createTariffDto.course, // ID курса из DTO
            { $push: { tariffs: newTariff._id } }, // Добавление ID тарифа в массив
            { new: true } // Опция, чтобы возвращался обновленный документ
        );

        return newTariff;
    }

    async findTariffById(tariffId: string): Promise<Tariff | null> {
        return await this.tariffModel.findById(tariffId).exec();
    }

    async deleteTariff(tariffId: string): Promise<Tariff> {
        const deletedTariff = await this.tariffModel.findByIdAndDelete(tariffId).exec();
        if (!deletedTariff) {
            throw new Error('Tariff not found');
        }

        // Удаление ID тарифа из массива тарифов в курсе
        await this.courseModel.updateMany(
            { tariffs: tariffId },
            { $pull: { tariffs: tariffId } }
        );

        return deletedTariff;
    }

    async findTariffsByCourse(courseId: string): Promise<Tariff[]> {
        return await this.tariffModel.find({ course: courseId }).exec();
    }

    async updateTariff(tariffId: string, updateTariffDto: UpdateTariffDto): Promise<Tariff> {
        const updatedTariff = await this.tariffModel.findByIdAndUpdate(tariffId, updateTariffDto, { new: true }).exec();
        if (!updatedTariff) {
            throw new Error('Tariff not found');
        }
        return updatedTariff;
    }
}
