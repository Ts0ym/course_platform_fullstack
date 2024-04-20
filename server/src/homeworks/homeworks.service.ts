import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Theme} from "../themes/themes.schema";
import {Model} from "mongoose";
import {Lesson} from "../lessons/lessons.shema";
import {CourseProgress} from "../courses-progress/courses-progress.schema";
import {Course} from "../courses/courses.schema";
import {Homework} from "./homeworks.schema";
import {FilesService} from "../files/files.service";
import {CreateHomeworkDto, UpdateHomeworkDto} from "./homeworks.dto";

@Injectable()
export class HomeworksService {
    constructor(
        @InjectModel(Homework.name) private readonly homeworkModel: Model<Homework>
    ) {}

    async create(dto: CreateHomeworkDto): Promise<Homework> {
        const createdHomework = new this.homeworkModel({...dto, grade: 0});
        return createdHomework.save();
    }

    async updateHomework(homeworkId: string, dto: UpdateHomeworkDto): Promise<Homework> {
        const updatedHomework = await this.homeworkModel.findByIdAndUpdate(homeworkId, dto, { new: true });
        if (!updatedHomework) {
            throw new NotFoundException('Homework not found');
        }
        return updatedHomework;
    }

    async deleteHomework(homeworkId: string): Promise<{ deleted: boolean, message?: string }> {
        const result = await this.homeworkModel.findByIdAndDelete(homeworkId);
        if (result) {
            return { deleted: true };
        } else {
            return { deleted: false, message: "Homework not found" };
        }
    }
}
