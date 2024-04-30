import {ICourse, ICourseProgress} from "@/types";

const getPercentage = (totalValue: number, completedValue: number) => {
    return Math.round((completedValue / totalValue) * 100)
}

export const getCourseProgress = (course: ICourse, progress: ICourseProgress) => {
    try{
        const totalLessons = course.themes.reduce((total, theme) => total + theme.lessons.length, 0)
        const completedLessons = progress.completedLessons.length
        return Math.round((completedLessons / totalLessons) * 100) || 0
    }catch (e) {
        return 0
    }
}