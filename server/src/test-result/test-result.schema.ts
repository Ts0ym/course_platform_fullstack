import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {LESSONS_COLLECTION_NAME, TEST_RESULTS_COLLECTION_NAME, USERS_COLLECTION_NAME} from "../constants";
import {User} from "../users/users.schema";
import {Lesson} from "../lessons/lessons.shema";

export interface TestAnswer {
    question: string;
    selectedOption: string;
    isCorrect: boolean;
}

@Schema({ collection: TEST_RESULTS_COLLECTION_NAME })
export class TestResult {
    @Prop({ type: Types.ObjectId, ref: USERS_COLLECTION_NAME, required: true })
    userId: Types.ObjectId | User;

    @Prop({ type: Types.ObjectId, ref: LESSONS_COLLECTION_NAME, required: true })
    lessonId: Types.ObjectId | Lesson;

    @Prop({ type: [{ question: String, selectedOption: String, isCorrect: Boolean }], required: true })
    answers: TestAnswer[];

    @Prop({ required: true })
    score: number;

    @Prop({ required: true, default: Date.now })
    testDate: Date;
}

export type TestResultDocument = TestResult & Document;
export const TestResultSchema = SchemaFactory.createForClass(TestResult);