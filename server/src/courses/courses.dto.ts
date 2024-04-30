export class CreateCourseDto{
    readonly title :string;
    readonly description: string;
    readonly image: any
    readonly tags: string
}

export class EnrollUserDto{
    readonly userId: string
    readonly courseId: string
}

export class GetCourseProgressDto{
    readonly courseId: string
    readonly userId: string
}

export class UpdateCourseDto {
    title?: string;
    description?: string;
    tags?: string;
    image?: Express.Multer.File;
}

