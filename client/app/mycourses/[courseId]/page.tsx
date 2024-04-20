'use client'

import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {useAppSelector} from "@/redux/hooks";
import styles from './CourseContent.module.sass'
import {Modal, ProgressBar} from "react-bootstrap";
import {ICourseTheme} from "@/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faUnlock} from "@fortawesome/free-solid-svg-icons";
import {API_URL} from "@/constants";
import CourseContentThemeCard from "@/components/UI/Courses/CourseContentThemeCard/CourseContentThemeCard";
import LessonList from "@/components/UI/Courses/LessonList/LessonList";

const Page = ({params: {courseId}}: {params: {courseId: string}}) => {

    const user = useAppSelector(state => state.auth.user);
    const {data, isPending, isError} = useQuery({
        queryFn: () => CoursesService.getCoursesWithProgress(user._id, courseId),
        queryKey: ['courseWithProgress'],
    })
    const [show, setShow] = React.useState(false);
    const [currentTheme, setCurrentTheme] = React.useState<ICourseTheme | null>(null)

    if (isPending) return <div>Loading...</div>;
    if (isError || !data) return <div>Error occurred or data is not available</div>;

    const { course , progress  } = data;

    const getCourseProgress = () => {
        try{
            const totalLessons = getTotalLessons()
            const completedLessons = getCompletedLessons()
            return (completedLessons / totalLessons) * 100
        }catch (e) {
            return 0
        }
    }

    const getTotalLessons = () => {
         return course?.themes.reduce((total: number, theme: ICourseTheme) => total + theme.lessons.length, 0)
    }

    const getCompletedLessons = () => {
        return progress?.completedLessons.length
    }

    const getThemePercentage = (theme: ICourseTheme) => {
        return theme.lessons.filter(lesson =>
            progress?.completedLessons.includes(lesson._id)
        ).length;
    }

    const handleClose = () => setShow(!show)

    return (
        <>
        <Modal show={show} onHide={handleClose} size={"lg"}>
            <Modal.Body>
                <LessonList
                    lessons={currentTheme ? currentTheme?.lessons : []}
                    completedLessonsIds={progress?.completedLessons || []}
                    onExit={handleClose}
                />
            </Modal.Body>
        </Modal>
        <div className={styles.coursePage}>
            <div className={styles.courseHeader}>
                <div className={styles.courseHeaderInfo}>
                    <p>Курс</p>
                    <h1>{course?.title}</h1>
                    <div className={styles.tagsContainer}>
                        {course?.tags.map((tag: string) => (
                            <div className={styles.tag} key={tag}>{tag}</div>
                        ))}
                    </div>
                    <div className={styles.progressContainer}>
                        <p>{getCourseProgress()}%</p>
                        <ProgressBar now={60}/>
                    </div>
                    <div className={styles.infoCards}>
                        <div className={styles.infoCard}>
                            <FontAwesomeIcon icon={faBook} className={styles.infoCardIcon}/>
                            <p><span>{getCompletedLessons()} из {getTotalLessons()}</span> <br/>
                                уроков</p>
                        </div>
                        <div className={styles.infoCard}>
                            <FontAwesomeIcon icon={faUnlock} className={styles.infoCardIcon}/>
                            <p><span>Доступен</span> <br/>
                                бессрочно</p>
                        </div>
                    </div>
                </div>
                <div className={styles.imageContainer}>
                    <img
                        src={API_URL + "image/" + course?.image}
                        alt={"image"}
                        className={styles.courseImage}
                    />
                </div>
            </div>
            <div className={styles.courseThemesContainer}>
                <div className={styles.courseThemes}>
                    {course?.themes.map((theme: ICourseTheme) =>
                        <CourseContentThemeCard
                            theme={theme}
                            key={theme._id}
                            percentComplete={getThemePercentage(theme)}
                            onClick={() => {
                                setCurrentTheme(theme)
                                setShow(true)
                            }}
                        />)
                    }
                </div>
            </div>
        </div>
    </>
    );
};

export default Page;