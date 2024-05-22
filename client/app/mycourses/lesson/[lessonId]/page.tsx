'use client'

import React, {useEffect, useState} from 'react';
import { useAppSelector } from "@/redux/hooks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CoursesService } from "@/services/coursesService";
import BreadCrumbs from "@/components/common/BreadCrumbs/BreadCrumbs";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faArrowUp,
    faBook,
    faCircleCheck, faCircleExclamation,
    faCircleQuestion,
    faList
} from "@fortawesome/free-solid-svg-icons";
import {Modal, ProgressBar} from "react-bootstrap";
import LessonList from "@/components/UI/Courses/LessonList/LessonList";
import styles from "./LessonPage.module.sass";
import {API_URL} from "@/constants";
import ReactPlayer from "react-player";
import HomeworkAddForm from "@/components/UI/Homeworks/HomeworkAddForm/HomeworkAddForm";
import {CompleteLessonDto, IAchievement, IHomework} from "@/types";
import HomeworksCard from "@/components/UI/Homeworks/HomeworksCard/HomeworksCard";
import TestComponent from "@/components/UI/Courses/TestComponent/TestComponent";
import TestResults from "@/components/UI/Courses/TestResults/TestResults";
import ProgressCircle from "@/components/common/ProgressCircle/ProgressCircle";
import {AchievementService} from "@/services/achievementsService";
import {NotificationsService} from "@/services/notificationsService";
import RateLessonForm from "@/components/UI/Courses/RateLessonForm/RateLessonForm";

const Page = ({ params: { lessonId } }: {params: {lessonId: string}}) => {
    const { user } = useAppSelector(state => state.auth);
    const router = useRouter();
    const [show, setShow] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => {
            CoursesService.setLastLesson(user._id, lessonId);
            return CoursesService.getLessonByUser(user._id, lessonId)
        },
        queryKey: ['courseWithProgress'],
    });

    const completeLessonMutation = useMutation({
        mutationFn: async (data: CompleteLessonDto) => {
            await CoursesService.completeLesson(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ['courseWithProgress']})
        },
        onError: () => {

        }

    })

    const checkAchievementsMutation = useMutation({
        mutationFn: () => AchievementService.checkAchievements(user._id),
        onSuccess: (newAchievements) => {
            if (newAchievements.length > 0) {
                newAchievements.forEach((achievement : IAchievement) => {
                    NotificationsService.showNotification(`Achievement unlocked: ${achievement.title}`, 'success');
                });
            }
        },
        onError: (error) => {
            NotificationsService.showNotification('Error checking achievements', 'error');
        }
    });

    useEffect(() => {
        if(!data?.isCompleted && data?.lesson?.type !== "quiz"
            &&
            !data?.lesson?.homework && user?._id && data?.lesson?._id && data?.lesson?.course?._id) {
            completeLessonMutation.mutate({
                userId: user?._id,
                lessonId: data?.lesson?._id,
                courseId: data?.lesson?.course?._id,
            });
        }
    }, [data]);

    useEffect(() => {
        checkAchievementsMutation.mutate();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !data ) return <div>Error occurred or data is not available</div>;

    const { lesson, homeworks, isCompleted, completedLessons, areAssignmentsAccessible} = data;
    const lessons = lesson?.theme?.lessons ?? [];
    const currentIndex = lessons.findIndex((l:any)=> l._id === lessonId);
    const navigationHandler = (id: string) => router.push(`/mycourses/lesson/${id}`);

    const breadcrumbs = [
        { title: "Курсы", path: "/mycourses" },
        { title: lesson?.course.title, path: `/mycourses/${lesson?.course?._id}` },
        { title: lesson?.title, path: `/mycourses/lesson/${lesson?._id}` },
    ];

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const getThemeProgress = () => {
        const courseCompletedLessons = data?.completedLessons
        const themeLessons = data?.lesson?.theme?.lessons
        const themeCompletedLessons = themeLessons?.filter((lesson: any) =>  courseCompletedLessons.includes(lesson._id))
        return themeCompletedLessons?.length
    }
    const completedPercentage = Math.round(getThemeProgress() / lessons?.length * 100)

    const isSendFormEnable = (homeworks: IHomework[])  => {
        return areAssignmentsAccessible && (homeworks.some((homework: IHomework) => homework.status === 'returned')
            && !homeworks.some((homework: IHomework) => homework.status === 'submitted')
                && !homeworks.some((homework: IHomework) => homework.status === 'graded'))
            || homeworks.length === 0 && areAssignmentsAccessible
    }

    return (
        <>
            <Modal show={show} onHide={() => setShow(!show)} size="lg">
                <Modal.Body>
                    <LessonList
                        onExit={() => setShow(!show)}
                        userId={user?._id}
                        courseId={lesson?.course?._id}
                        themeId={lesson?.theme?._id}
                        themeTitle={lesson?.theme?.title}
                    />
                </Modal.Body>
            </Modal>
            <title>{lesson?.title}</title>
            <div className={styles.lessonPage}>

                <BreadCrumbs breadcrumbs={breadcrumbs}/>

                <div className={styles.header}>

                    <div className={styles.buttonContainer}>
                        <CustomButton onClick={() => setShow(!show)} color="white">
                            <FontAwesomeIcon icon={faList} className={styles.lessonsIcon}/>
                        </CustomButton>
                    </div>
                    <FontAwesomeIcon icon={faBook} className={styles.bookIcon}/>
                    <div className={styles.lessonInfoContainer}>
                        <p>{lesson?.theme?.title}</p>
                        <h1 className={styles.lessonTitle}>{lesson?.title}</h1>
                    </div>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressTitles}>
                            <p>{completedPercentage}%</p>
                            <p>{getThemeProgress()}/{lessons?.length} уроков</p>
                        </div>
                        <div className={styles.progressBarContainer}>
                            <ProgressCircle percent={completedPercentage}/>
                        </div>
                    </div>
                    <div className={styles.upButton} onClick={() => scrollToTop()}>
                        <FontAwesomeIcon icon={faArrowUp} />
                    </div>

                </div>
                <div className={styles.navButtons}>
                    {currentIndex > 0 && (
                        <div className={styles.backButton}>
                            <CustomButton
                                onClick={() => navigationHandler(lessons[currentIndex - 1]._id)}
                                color="white"
                                outline={true}
                            >
                                Предыдущий урок
                            </CustomButton>
                        </div>
                    )}
                    {currentIndex < lessons.length - 1 && (
                        <div className={styles.nextButton}>
                            <CustomButton
                                onClick={() => navigationHandler(lessons[currentIndex + 1]._id)}
                                color="white"
                                outline={true}
                            >
                                Следующий урок
                            </CustomButton>
                        </div>
                    )}
                </div>
                {
                    lesson?.type !== "quiz" && lesson?.description !== ""
                    &&
                    <div className={styles.lessonDescription}>
                        <p>
                            {lesson?.description}
                        </p>
                    </div>
                }
                {
                    lesson?.type === "video"  &&
                    <div className={styles.videoContainer}>
                        <ReactPlayer
                            url={API_URL + "video/" + lesson.videoUrl}
                            className={styles.videoPlayer}
                            controls={true}
                            width={"100%"}
                            height={"100%"}
                            style={{borderRadius: "1em"}}
                        />
                    </div>
                }
                {
                    lesson?.type === "text" &&
                    <div className={styles.textContainer} dangerouslySetInnerHTML={{__html: lesson?.text}}/>
                }

                {
                    lesson?.type === "quiz" && isCompleted === true ?
                        (<div className={styles.quizContainer}>
                            <FontAwesomeIcon icon={faCircleCheck} className={styles.completedIcon}/>
                            <h1>Тест выполнен!</h1>
                            <TestResults userId={user._id} lessonId={lessonId}/>
                        </div>)
                        : lesson?.type === "quiz" && isCompleted === false ? (
                        <div className={styles.quizContainer}>
                            <FontAwesomeIcon icon={faCircleQuestion} className={styles.quizIcon}/>
                            <h1>Настало время для теста!</h1>
                            <p>Проверь свои знания и узнай что ты изучил.</p>
                            <TestComponent
                                questions={lesson?.questions}
                                lessonId={lessonId}
                                userId={user._id}
                                courseId={lesson?.course?._id}
                            />
                        </div>
                    ) : null
                }
                {
                    lesson?.homework &&
                    <div className={styles.homeworkContainer}>
                        <h1><FontAwesomeIcon icon={faCircleExclamation} className={styles.homeworkIcon}/> Задание</h1>
                        {
                            lesson?.homeworkText
                            &&
                            <p className={styles.homeworkText}>
                                {lesson?.homeworkText}
                            </p>
                        }
                        {
                            homeworks.length > 0
                            && homeworks.map((homework: IHomework) => <HomeworksCard homework={homework} key={homework._id}/>)
                        }
                        {
                            isSendFormEnable(homeworks)
                            && <HomeworkAddForm lessonId={lessonId} userId={user._id} prevHomework={homeworks.length !== 0 ? homeworks[homeworks.length-1]._id : null}/>
                        }
                    </div>
                }
                {
                    currentIndex < lessons.length - 1 &&
                    <div className={styles.nextButtonContainer}>
                        <CustomButton
                            onClick={() => navigationHandler(lessons[currentIndex + 1]._id)}
                            color={"black"}>Следующий урок <FontAwesomeIcon icon={faArrowRight}/></CustomButton>
                    </div>
                }
                <RateLessonForm />
            </div>
        </>
    );
};

export default Page;
