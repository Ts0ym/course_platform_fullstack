import { Types } from 'mongoose';

export class CreateTestResultDto {
    userId: Types.ObjectId;
    lessonId: Types.ObjectId;
    answers: {
        question: string;
        selectedOption: string;
        isCorrect: boolean;
    }[];
    score: number;
}
