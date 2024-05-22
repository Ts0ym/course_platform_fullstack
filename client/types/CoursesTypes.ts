import {IUser} from "@/types/UsersTypes";

export interface ICourse{
    _id: string
    title: string
    description: string
    image: string
    themes: ICourseTheme[]
    tags: string[]
    tariffs: ITariff[]
}

export interface ICourseShortInfo{
    _id: string
    title: string
    description: string
    image: string
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
    previousVersion?: string
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

export type homeworkStatus = "submitted" | "returned" | "graded"

export interface IHomework{
    _id: string,
    grade: number
    lessonId: string,
    userId: IUser,
    content: string,
    sendTime: string,
    assessment: string,
    status: homeworkStatus,
    previousVersion: IHomework | null
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

export interface ICourseRequest {
    _id?: string
    userName: string;
    userEmail: string;
    userPhone: string;
    course: any; // или тип, который используется для идентификаторов курсов
    comment?: string; // необязательное поле
    sendTime: any;
    checked?: boolean;
}

export interface CreateConsultationRequestDto {
    user: string;
    requestDate: Date;
    comment?: string;
    status: 'pending' | 'approved' | 'rejected';
    startTime: Date;
    endTime: Date;
}

export interface IConsultationRequest {
    _id?: string
    user: any;
    requestDate: Date;
    comment?: string;
    status: 'pending' | 'approved' | 'rejected';
    startTime: Date;
    endTime: Date;
}

export type LessonType = "text" | "video" | "quiz"

export interface IMeetingData{
    _id: string
    name: string
    email: string
    startTime: string
    endTime: string
    inviteeUri: string
    cancel_url: string
    join_url: string
    password: string
    createTime: string
}

export interface CreateTariffDto {
    readonly name: string;
    readonly duration: number;
    readonly price: number;
    readonly freeConsultations: number;
    readonly course: string;
    readonly description: string;
}

export interface UpdateTariffDto {
    readonly name?: string;
    readonly duration?: number;
    readonly price?: number;
    readonly freeConsultations?: number;
    readonly description?: string;
}

export interface ITariff {
    _id: string
    name: string
    description: string
    duration: number
    price: number
    freeConsultations: number
    course: string
}

export interface IAchievement{
    _id: string
    title: string
    description: string
    icon: string
    condition: string
    achieved?: boolean;
}