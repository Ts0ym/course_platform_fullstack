import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Theme} from "../themes/themes.schema";
import {Model} from "mongoose";
import {Lesson} from "../lessons/lessons.shema";
import {CourseProgress} from "../courses-progress/courses-progress.schema";
import {Course} from "../courses/courses.schema";
import {Homework} from "./homeworks.schema";
import {FilesService} from "../files/files.service";

@Injectable()
export class HomeworksService {
    constructor(
        @InjectModel(Homework.name) private readonly homeworkModel: Model<Homework>
    ) {}

    async create(homework: Homework): Promise<Homework> {
        const createdHomework = new this.homeworkModel(homework);
        return createdHomework.save();
    }
}
