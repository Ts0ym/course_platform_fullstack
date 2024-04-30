import {IUser} from "@/types/UsersTypes";

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

export interface CreateHomeworkDto{
    lessonId: string
    userId: string
    content: string
    sendTime: Date
}

export interface EditHomeworkDto{
    content: string
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

export interface IHomework{
    _id: string,
    lessonId: string,
    userId: IUser,
    content: string,
    grade: number,
    sendTime: string,
    isRated: boolean,
    assessment: string
}

export interface ICourseProgress{
    _id: string,
    user: string,
    course: string,
    completedLessons: string[]
}

export interface IBugReportData{
    email: string,
    description: string,
    severity: number
}

export interface CompleteLessonDto{
    userId: string,
    lessonId: string,
    courseId: string
}

export interface UpdateCourseDto{
    title?: string,
    description?: string,
    tags?: string,
    image?: File | null
}

export type LessonType = "text" | "video" | "quiz"