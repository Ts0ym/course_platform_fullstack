export interface ICourse{
    _id: string
    title: string
    description: string
    image: string
    themes: ICourseTheme[]
    tags: string[]
}

export interface ICourseTheme{
    _id: string
    title: string
    description: string
    lessons: ILesson[]
}

export interface CreateCourseDto{
    title: string
    description: string
    file: File | Blob
}

export interface CreateThemeDto{
    courseId: string
    title: string
    description: string
}

export interface CreateLessonDto{
    themeId: string
    title: string
    type: LessonType
    content?: string
    questions?: ILessonQuestion[]
    video: File
}

export interface ILesson{
    _id: string
    title: string
    type: LessonType
    content?: string
    questions?: ILessonQuestion[]
    videoUrl?: string
}

export interface ILessonQuestion{
    question: string
    options: string[]
    correctAnswer: string
}

export type LessonType = "text" | "video" | "quiz"