import React from 'react';
import styles from './LessonList.module.sass';
import {ILesson} from "@/types";
import {
    faChevronRight, faCircleCheck, faCoins, faExclamationCircle,
    faFileAlt,
    faQuestionCircle,
    faVideo
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {any} from "prop-types";

const getLessonIcon = (type: string) => {
    switch (type) {
        case 'video':
            return faVideo;
        case 'text':
            return faFileAlt;
        case 'quiz':
            return faQuestionCircle;
        default:
            return faQuestionCircle;
    }
};

const LessonList = ({ themeId, userId, courseId, onExit, themeTitle} : { themeId:string, userId:string, courseId:string, onExit: () => void, themeTitle:string}) => {
    const router = useRouter();

    // Используем useQuery для получения данных с сервера
    const { data: lessons, isLoading, isError } = useQuery({
        queryFn:() => CoursesService.getLessonsWithStatuses(themeId, userId, courseId),
        queryKey:['lessons', themeId, userId, courseId]
    });

    lessons?.forEach((lesson: ILesson, index: number)  =>  {
            console.log(lesson)
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading lessons</div>;
    }

    return (
        <div className={styles.lessonList}>
            <button className={styles.closeButton} onClick={() => onExit()} />
            <h1 className={styles.listTitle}>Тема</h1>
            <h1 className={styles.themeTitle}>{themeTitle}</h1>
            {lessons.map((lesson: any, index: number) => (
                <div
                    className={styles.lessonItem}
                    key={index}
                    onClick={() => router.push(`/mycourses/lesson/${lesson._id}`)}
                >
                    <div className={styles.infoContainer}>
                        <FontAwesomeIcon
                            icon={getLessonIcon(lesson.type)}
                            className={styles.lessonIcon}
                        />
                        <p>{index + 1}. {lesson.title}</p>
                    </div>
                    {lesson.lessonStatus === 'completed' && (
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className={styles.completedIcon}
                        />
                    )}
                    {lesson.lessonStatus === 'returned' && (
                        <FontAwesomeIcon
                            icon={faExclamationCircle}
                            className={styles.returnedIcon}
                        />
                    )}
                    <div className={styles.redirectButton}>
                        {
                            lesson.reward > 0 &&
                            <div className={styles.rewardContainer}>
                                <p>{lesson.reward}</p>
                                <FontAwesomeIcon
                                    icon={faCoins}
                                    className={styles.coinIcon}
                                />
                            </div>
                        }
                        <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LessonList;