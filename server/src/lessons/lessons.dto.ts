import {Prop} from "@nestjs/mongoose";
import {LessonQuestion, LessonType} from "./lessons.shema";

export class CreateLessonDto{
    themeId: string;
    title: string;
    type: LessonType;
    content?: string;
    questions?: string;
    text?: string;
    homework: boolean;
    // videoUrl?: string;
}