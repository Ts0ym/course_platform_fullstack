export class CreateHomeworkDto {
    lessonId: string;
    userId: string;
    content: string;
    sendTime: Date;
}

export class UpdateHomeworkDto{
    content: string
}