'use client'

import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {useAppSelector} from "@/redux/hooks";
import styles from './CourseContent.module.sass'
import {Modal, ProgressBar} from "react-bootstrap";
import {ICourse, ICourseProgress, ICourseTheme} from "@/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faLock, faUnlock} from "@fortawesome/free-solid-svg-icons";
import {API_URL} from "@/constants";
import CourseContentThemeCard from "@/components/UI/Courses/CourseContentThemeCard/CourseContentThemeCard";
import LessonList from "@/components/UI/Courses/LessonList/LessonList";
import BreadCrumbs from "@/components/common/BreadCrumbs/BreadCrumbs";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useRouter} from "next/navigation";
import {getCourseProgress} from "@/utils/coursesDataUtils";

interface CourseWithProgress{
    course: ICourse
    progress: ICourseProgress
}

const CourseContentPage = ({params: {courseId}}: {params: {courseId: string}}) => {

    const user = useAppSelector(state => state.auth.user);
    const {data : CourseWithProgress, isPending, isError} = useQuery({
        queryFn: () => CoursesService.getCoursesWithProgress(user._id, courseId),
        queryKey: ['courseWithProgress'],
    })
    const [showLessons, setShowLessons] = React.useState(false);
    const [currentTheme, setCurrentTheme] = React.useState<ICourseTheme | null>(null)
    const router = useRouter()

    if (isPending) return <div>Loading...</div>;
    if (isError || !CourseWithProgress) return <div>Error occurred or data is not available</div>;

    const { course , progress  } = CourseWithProgress;
    const getTotalLessons = () => {
         return course?.themes.reduce((total: number, theme: ICourseTheme) => total + theme.lessons.length, 0)
    }

    const getCompletedLessons = () => {
        return progress?.completedLessons.length
    }

    const getThemePercentage = (theme: ICourseTheme) => {
        return Math.round(theme.lessons.filter(lesson =>
            progress?.completedLessons.includes(lesson._id)
        ).length / theme.lessons.length * 100);
    }

    const handleClose = () => setShowLessons(!showLessons)
    const breadcrumbs = [
        {title: "Курсы", path: "/mycourses"},
        {title: course?.title, path: "/mycourses/" + courseId}
    ]

    const getRemainingDays = () => {
        if (!progress || !progress.tariff || !progress.startDate) {
            return 0;
        }
        const tariffDuration = progress.tariff.duration;
        const startDate = new Date(progress.startDate);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - startDate.getTime();
        const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const remainingDays = tariffDuration - daysPassed;
        return remainingDays >= 0 ? remainingDays : 0;
    }

    return (
        <>
        <Modal show={showLessons} onHide={handleClose} size={"lg"}>
            <Modal.Body>
                <LessonList
                    courseId={course?._id || ''}
                    themeId={currentTheme?._id || ''}
                    userId={user._id}
                    themeTitle={currentTheme?.title || ''}
                    // lessons={currentTheme ? currentTheme?.lessons : []}
                    // completedLessonsIds={progress?.completedLessons || []}
                    onExit={handleClose}
                />
            </Modal.Body>
        </Modal>
        <title>{course?.title}</title>
        <div className={styles.coursePage}>
            <div className={styles.courseHeader}>
                <div className={styles.breadcrumbContainer}>
                    <div className={styles.backButtonContainer}>
                        <CustomButton onClick={() => router.back()} color={"white"} outline>Назад</CustomButton>
                    </div>
                    <div className={styles.breadcrumb}>
                        <BreadCrumbs breadcrumbs={breadcrumbs}/>
                    </div>
                </div>
                <div className={styles.courseHeaderInfo}>
                    <p>Курс</p>
                    <h1>{course?.title}</h1>
                    <div className={styles.tagsContainer}>
                        {course?.tags.map((tag: string) => (
                            <div className={styles.tag} key={tag}>{tag}</div>
                        ))}
                    </div>
                    <div className={styles.progressContainer}>
                        <p>{getCourseProgress(course, progress)}%</p>
                        <ProgressBar now={getCourseProgress(course, progress)}/>
                    </div>
                    <div className={styles.infoCards}>
                        <div className={styles.infoCard}>
                            <FontAwesomeIcon icon={faBook} className={styles.infoCardIcon}/>
                            <p><span>{getCompletedLessons()} из {getTotalLessons()}</span> <br/>
                                уроков</p>
                        </div>
                        <div className={styles.infoCard}>
                            {
                                getRemainingDays() > 0
                                ?
                                <>
                                    <FontAwesomeIcon icon={faUnlock} className={styles.infoCardIcon}/>
                                    <p><span>Задания доступны</span><br/>
                                        {getRemainingDays()} дней</p>
                                </>
                                :
                                <>
                                    <FontAwesomeIcon icon={faLock} className={styles.infoCardIcon}/>
                                    <p><span>Задания</span><br/>не доступны</p>
                                </>
                            }
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
                    {course?.themes.map((theme: ICourseTheme, index: number) =>
                        <CourseContentThemeCard
                            theme={theme}
                            index={index}
                            key={theme._id}
                            percentComplete={getThemePercentage(theme) || 0}
                            onClick={() => {
                                setCurrentTheme(theme)
                                setShowLessons(true)
                            }}
                        />)
                    }
                </div>
            </div>
        </div>
    </>
    );
};

export default CourseContentPage;