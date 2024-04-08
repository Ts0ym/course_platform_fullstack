'use client'

import React from 'react';
import styles from './MyCoursesPage.module.sass';
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {useAppSelector} from "@/redux/hooks";
import LastCourseCard from "@/components/UI/Courses/LastCourseCard/LastCourseCard";
import {ICourse} from "@/types";
import CoursesCardCabinet from "@/components/UI/Courses/CoursesCardCabinet/CoursesCardCabinet";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useRouter} from "next/navigation";


const Page = () => {

    const router = useRouter();
    const user = useAppSelector(state => state.auth.user);
    const {data : LastCourseData, isLoading, isError} = useQuery({
        queryFn: () => CoursesService.getLastCourse(user._id),
        queryKey: ['lastCourse'],
    })

    const { data: allCoursesData, isLoading: isAllCoursesLoading, isError: isAllCoursesError } = useQuery({
        queryKey: ['allCourses', user?._id], // Используйте другой ключ запроса
        queryFn: () => CoursesService.getUserCourses(user?._id),
        enabled: !!user?._id
    });

    const { data: recommendedCoursesData, isLoading: isRecommendedCoursesLoading, isError: isRecommendedCoursesError } = useQuery({
        queryKey: ['recommendedCourses', user?._id], // Используйте другой ключ запроса
        queryFn: () => CoursesService.getRecommendedCourses(user?._id),
        enabled: !!user?._id
    });


    return (
        <div className={styles.myCoursesPage}>
            {
                LastCourseData &&
                <div className={styles.lastCourseContainer}>
                    <h1 className={styles.sectionHeader}>Последний курс</h1>
                    <LastCourseCard course={LastCourseData.course} progress={LastCourseData.progress}/>
                </div>
            }
            <div className={styles.allMyCoursesContainer}>
                <h1 className={styles.sectionHeader}>Ваши курсы</h1>
                <div className={styles.courseList}>
                    { allCoursesData && allCoursesData.map((course: ICourse) =>
                            <CoursesCardCabinet
                                key={course._id}
                                course={course}
                                onClick={() => router.push('/mycourses/' + course._id)}/>
                        )}
                </div>
            </div>
            <div className={styles.allMyCoursesContainer}>
                <div className={styles.courseListHeader}>
                    <h1 className={styles.sectionHeader}>Рекомендуемые курсы</h1>
                    <CustomButton onClick={() => {router.push('/courses')}} color={'black'}>
                        Смотреть все
                    </CustomButton>
                </div>
                <div className={styles.courseList}>
                    { recommendedCoursesData && recommendedCoursesData.map((course: ICourse) =>
                        <CoursesCardCabinet key={course._id} course={course}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;