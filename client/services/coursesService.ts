import $authApi from "@/http/authApi";
import {
    CompleteLessonDto, CreateConsultationRequestDto,
    CreateCourseDto,
    CreateHomeworkDto, CreateTariffDto,
    CreateThemeDto,
    EditHomeworkDto,
    IBugReportData, IConsultationRequest,
    ICourse, ICourseRequest, ICourseShortInfo, UpdateTariffDto
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

    public static async getCourseShortInfo(id: string): Promise<ICourseShortInfo>{
        const response = await $authApi.get(`/courses/shortinfo/${id}`)
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

    public static async getRecommendedCourses(userId: string, tags?: string[], search?: string) {
        try {
            const query = new URLSearchParams();
            if (tags && tags.length) query.append('tags', tags.join(','));
            if (search) query.append('search', search);

            const response = await $authApi.get(`/courses/recommended/${userId}?${query.toString()}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting recommended courses:', error);
            throw error;
        }
    }

    public static async getCoursesByTagsAndSearch(tags?: string[], search?: string) {
        try {
            const query = new URLSearchParams();
            if (tags && tags.length) query.append('tags', tags.join(','));
            if (search) query.append('search', search);

            const response = await $authApi.get(`/courses?${query.toString()}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting courses by tags and search:', error);
            throw error;
        }
    }

    public static async getCoursesWithProgress(userId: string, courseId: string){
        const response =
            await $authApi.get(`/courses/progress`, {params: {userId, courseId}})
        console.log(response.data)
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

    public static async getUncheckedHomeworks(){
        try{
            const response = await $authApi.get(`/homeworks`);
            console.log(response.data)
            return response.data
        } catch (error) {
            console.error('Error getting all homeworks:', error);
            throw error;
        }
    }

    public static async getCheckedHomeworks(){
        try{
            const response = await $authApi.get(`/homeworks/checked`);
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
                assessment,
                grade,
                homeworkId
            });
            return response.data;
        } catch (error) {
            console.error('Error rating homework:', error);
            throw error;
        }
    }

    public static async requestRevision(homeworkId: string, comments: string) {
        try {
            const response = await $authApi.put(`/homeworks/${homeworkId}/request-revision`, {
                comments
            });
            return response.data;
        } catch (error) {
            console.error('Error requesting revision for homework:', error);
            throw error;
        }
    }

    public static async getHomeworkHistory(lessonId: string, userId: string, homeworkId: string) {
        try {
            // Формируем URL с query-параметрами
            const url = `/homeworks/history?lessonId=${encodeURIComponent(lessonId)}&userId=${encodeURIComponent(userId)}&homeworkId=${encodeURIComponent(homeworkId)}`;
            const response = await $authApi.get(url);
            return response.data;
        } catch (error) {
            console.error('Error getting homework history:', error);
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

    public static async getUncheckedCourseRequests() {
        try {
            const response = await $authApi.get('/course-request/unchecked');
            return response.data;
        } catch (error) {
            console.error('Error retrieving unchecked course requests:', error);
            toast.error('Ошибка при получении непросмотренных заявок на курсы.');
            throw error;
        }
    }

    public static async getCheckedCourseRequests() {
        try {
            const response = await $authApi.get('/course-request/checked');
            return response.data;
        } catch (error) {
            console.error('Error retrieving checked course requests:', error);
            toast.error('Ошибка при получении непросмотренных заявок на курсы.');
            throw error;
        }
    }

    public static async createCourseRequest(courseRequestData: ICourseRequest) {
        try {
            const response = await $authApi.post('/course-request', courseRequestData);
            return response.data;
        } catch (error) {
            console.error('Error creating course request:', error);
            toast.error('Ошибка при создании заявки на курс.');
            throw error;
        }
    }

    static async markRequestAsChecked(requestId: string) {
        try {
            const response = await $authApi.patch(`/course-request/${requestId}/check`);
            return response.data;
        } catch (error) {
            console.error('Error marking request as checked:', error);
            throw error;
        }
    }

    static async approveConsultationRequest(requestId: string, startTime: Date, endTime: Date) {
        try {
            const response = await $authApi.patch(`/consultation-requests/${requestId}/approve`, { startTime, endTime });
            return response.data;
        } catch (error) {
            console.error('Error approving request:', error);
            throw error;
        }
    }

    static async rejectConsultationRequest(requestId: string){
        try{
            const response = await $authApi.patch(`/consultation-requests/${requestId}/reject`);
            return response.data;
        }catch(error){
            throw error;
        }
    }

    static async createConsultationRequest(createConsultationRequestDto: CreateConsultationRequestDto) {
        try {
            const response = await $authApi.post('/consultation-requests', createConsultationRequestDto);
            return response.data;
        } catch (error) {
            console.error('Error creating consultation request:', error);
            throw error;
        }
    }

    static async getPendingConsultationRequests() {
        try {
            const response = await $authApi.get('/consultation-requests/pending');
            return response.data;
        } catch (error) {
            console.error('Error getting pending requests:', error);
            throw error;
        }
    }

    static async getApprovedConsultationRequests() {
        try {
            const response = await $authApi.get('/consultation-requests/approved');
            return response.data;
        } catch (error) {
            console.error('Error getting approved requests:', error);
            throw error;
        }
    }

    static async getPendingConsultationRequestsForUser(userId: string) {
        try {
            const response = await $authApi.get(`/consultation-requests/${userId}/pending`);
            return response.data;
        } catch (error) {
            console.error('Error getting pending requests for user:', error);
            throw error;
        }
    }

    static async getApprovedConsultationRequestsForUser(userId: string) {
        try {
            const response = await $authApi.get(`/consultation-requests/${userId}/approved`);
            return response.data;
        } catch (error) {
            console.error('Error getting approved requests for user:', error);
            throw error;
        }
    }

    static async getAllConsultationRequestsForUser(userId: string){
        try {
            const response = await $authApi.get(`/consultation-requests/${userId}/all`);
            return response.data;
        } catch (error) {
            console.error('Error getting approved requests for user:', error);
            throw error;
        }
    }

    static async getAllMeetingsByEmail(email: string) {
        try {
            const response = await $authApi.get(`/meetings?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error) {
            console.error('Error getting meetings by email:', error);
            throw error;
        }
    }

    static async createTariff(tariffData: CreateTariffDto) {
        try {
            const response = await $authApi.post(`/tariffs`, tariffData);
            return response.data;
        } catch (error) {
            console.error('Error creating tariff:', error);
            throw error;
        }
    }

    static async getTariffById(tariffId: string) {
        try {
            const response = await $authApi.get(`/tariffs/${tariffId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting tariff by ID:', error);
            throw error;
        }
    }

    static async getTariffsByCourse(courseId: string) {
        try {
            const response = await $authApi.get(`/tariffs/course/${courseId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting tariffs by course:', error);
            throw error;
        }
    }

    static async updateTariff(tariffId: string, updateData: UpdateTariffDto) {
        try {
            const response = await $authApi.patch(`/tariffs/${tariffId}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating tariff:', error);
            throw error;
        }
    }

    static async deleteTariff(tariffId: string) {
        try {
            const response = await $authApi.delete(`/tariffs/${tariffId}`);
            return response.data;  // Возможно, здесь лучше вернуть true/false или изменить тип возвращаемого значения
        } catch (error) {
            console.error('Error deleting tariff:', error);
            throw error;
        }
    }

    static async getLessonsWithStatuses(themeId: string, userId: string, courseId: string) {
        try {
            const response = await $authApi.get(`/lessons/theme/${themeId}`, {
                params: { userId, courseId }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting lessons with statuses:', error);
            throw error;
        }
    }

    public static async getUniqueTags() {
        try {
            const response = await $authApi.get(`/courses/tags`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting unique tags:', error);
            throw error;
        }
    }
}