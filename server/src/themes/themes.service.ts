import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Course} from "../courses/courses.schema";
import mongoose, {Model, Schema, Types} from "mongoose";
import {Theme, ThemeDocument} from "./themes.schema";
import {CreateThemeDto} from "./themes.dto";
import {Lesson} from "../lessons/lessons.shema";



@Injectable()
export class ThemesService {
    constructor(
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,
        @InjectModel(Theme.name) private readonly themeModel: Model<Theme>,
        @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>
    ) {}

    async create(dto: CreateThemeDto){
        const {courseId, ...rest } = dto
        const course = await this.courseModel.findById(dto.courseId)
        const theme = await this.themeModel.create({...rest, lessons: []})
        course.themes.push(theme._id)
        course.save()
        return theme
    }

    async delete(id: string){
        const theme = await this.themeModel.findById(id).exec()
        if (!theme) {
            throw new Error(`Course with id ${id} not found`);
        }
        // Удалить все темы, связанные с этим курсом
        await this.lessonModel.deleteMany({ _id: { $in: theme.lessons } });
        // Удалить курс
        await this.themeModel.findByIdAndDelete(id)
    }

    async getOne(id: string){
        const theme = await this.themeModel.findById(id).exec()
        console.log(theme)
        return theme
    }

    async getAll(){
        return await this.themeModel.find().populate('lessons').exec();
    }
}
