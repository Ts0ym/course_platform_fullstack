import $authApi from "@/http/authApi";
import {CreateCourseDto, CreateThemeDto, ICourse} from "@/types";

export class CoursesService {
    public static async getAllCourses(): Promise<ICourse[]> {
        const response = await $authApi.get('/courses')
        return response.data
    }

    public static async getCourse(id: string): Promise<ICourse>{
        const response = await $authApi.get(`/courses/${id}`)
        return response.data
    }

    public static async createCourse(createCourseDTO: FormData){
        const response = await $authApi.post('/courses', createCourseDTO)
        console.log(response)
        return response.data
    }

    public static async deleteCourse(id: string){
        const response = await $authApi.delete(`/courses/${id}`)
        console.log(response)
        return response.data
    }

    public static async addThemeToCourse(createThemeDto: CreateThemeDto){
        const response = await $authApi.post('/themes', createThemeDto)
    }

    public static async addLessonToTheme(createLessonDto: FormData, onUploadProgress: (minValue: number, maxValue: number) => void){

        let apiPath = "/lessons"
        if(createLessonDto.get("type") === "video"){
            console.log("this is a video!")
            apiPath = "/lessons/video"
        }

        await $authApi.post(apiPath, createLessonDto, {
            onUploadProgress: (progressEvent) => {
                console.log(`Loaded ${progressEvent.loaded} bytes out of ${progressEvent.total}`)
                onUploadProgress(progressEvent.loaded, progressEvent.total ?? 0)
            }
        })
    }

    public static async deleteLesson(id: string){
        const response = await $authApi.delete(`/lessons/${id}`)
        return response.data
    }

    public static async getLastCourse(userId: string){
        const response = await $authApi.get(`/courses/lastcourse/${userId}`)
        return response.data
    }

    public static async getUserCourses(userId: string){
        const response = await $authApi.get(`/courses/usercourses/${userId}`)
        return response.data
    }

    public static async getRecommendedCourses(userId: string){
        const response = await $authApi.get(`/courses/recommended/${userId}`)
        return response.data
    }

    public static async getCoursesWithProgress(userId: string, courseId: string){
        const response =
            await $authApi.get(`/courses/progress`, {params: {userId, courseId}})
        return response.data
    }

    public static async getLessonByUser(userId: string, lessonId: string){
        const response = await $authApi.get(`/lessons/`, {params: {lessonId, userId}})
        console.log(response.data)
        return response.data
    }
}