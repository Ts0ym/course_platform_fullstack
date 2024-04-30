import $authApi from "@/http/authApi";
import {
    CompleteLessonDto,
    CreateCourseDto,
    CreateHomeworkDto,
    CreateThemeDto,
    EditHomeworkDto,
    IBugReportData,
    ICourse
} from "@/types";
import {toast} from "react-toastify";

export interface TestAnswer {
    question: string;
    selectedOption: string;
    isCorrect: boolean;
}

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

    public static async deleteTheme(themeId: string) {
        try {
            const response = await $authApi.delete(`/themes/${themeId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting theme:', error);
            throw error;
        }
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
        const response = await $authApi.get(`/users/lastLesson/${userId}`)
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

    public static async addHomeworkToLesson(dto: CreateHomeworkDto){
        const response = await $authApi.post(`/homeworks`, dto)
    }

    public static async updateHomework(homeworkId: string, dto: EditHomeworkDto) {
        try {
            const response = await $authApi.put(`/homeworks/${homeworkId}`, dto);
            console.log('Homework updated:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating homework:', error);
            throw error;
        }
    }

    public static async deleteHomework(homeworkId: string) {
        try {
            const response = await $authApi.delete(`/homeworks/${homeworkId}`);
            console.log('Homework deleted:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error deleting homework:', error);
            throw error;
        }
    }

    public static async getAllHomeworks(){
        try{
            const response = await $authApi.get(`/homeworks`);
            console.log(response.data)
            return response.data
        } catch (error) {
            console.error('Error getting all homeworks:', error);
            throw error;
        }
    }

    public static async setLastLesson(userId: string, lessonId: string){
        try{
            const response = await $authApi.post('/users/lastlesson', {userId, lessonId})
            return response.data
        }catch(error){
            throw error
        }
    }

    public static async submitTestResults(dto: {
        userId: string;
        lessonId: string;
        answers: TestAnswer[];
        score: number;
    }) {
        try {
            const response = await $authApi.post('/test-result', dto);
            console.log('Test results submitted:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error submitting test results:', error);
            throw error;
        }
    }

    public static async getTestResult(userId: string, lessonId: string) {
        try {
            const response = await $authApi.get(`/test-result/completed`, {
                params: { userId, lessonId }
            });
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error checking test completion:', error);
            throw error;
        }
    }

    public static async completeLesson(body: CompleteLessonDto){
        try{
            const response = await $authApi.post('lessons/complete', body)
            return response.data
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    public static async createBugReport(bugReportData: IBugReportData) {
        try {
            const response = await $authApi.post('/bugreports', bugReportData);
            console.log('Bug report created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating bug report:', error);
            toast.error('Ошибка при создании баг-репорта.');
            throw error;
        }
    }

    public static async getAllBugReports() {
        try {
            const response = await $authApi.get('/bugreports');
            console.log('All bug reports:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error retrieving bug reports:', error);
            toast.error('Ошибка при получении баг-репортов.');
            throw error;
        }
    }

    public static async getHomeworkById(homeworkId: string) {
        try {
            const response = await $authApi.get(`/homeworks/${homeworkId}`);
            return response.data;
        } catch (error) {
            console.error('Error retrieving homework:', error);
            toast.error('Ошибка при получении домашнего задания.');
            throw error;
        }
    }

    public static async rateHomework(homeworkId: string, grade: number, assessment: string) {
        try {
            const response = await $authApi.post(`/homeworks/rate`, {
                homeworkId,
                grade,
                assessment
            });
            return response.data;
        } catch (error) {
            console.error('Error rating homework:', error);
            throw error;
        }
    }

    static async updateCourse(courseId: string, courseData: any) {
        try {
            // FormData используется для отправки файлов и текстовых данных
            const formData = new FormData();
            Object.keys(courseData).forEach(key => {
                if (key === 'image' && courseData[key] instanceof File) {
                    formData.append(key, courseData[key], courseData[key].name);
                } else if (typeof courseData[key] === 'object') {
                    formData.append(key, JSON.stringify(courseData[key]));
                } else {
                    formData.append(key, courseData[key]);
                }
            });

            const response = await $authApi.patch(`/courses/${courseId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    }
}