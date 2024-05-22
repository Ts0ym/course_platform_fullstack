export class CreateHomeworkDto {
    lessonId: string;
    userId: string;
    content: string;
    sendTime: Date;
    previousVersion: string
}

export class UpdateHomeworkDto{
    content: string
}

export class RateHomeworkDto{
    homeworkId: string;
    assessment: string;
    grade: number;
}