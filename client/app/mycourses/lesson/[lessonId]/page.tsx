'use client'

import React, { useState } from 'react';
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CoursesService } from "@/services/coursesService";
import BreadCrumbs from "@/components/common/BreadCrumbs/BreadCrumbs";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import LessonList from "@/components/UI/Courses/LessonList/LessonList";
import styles from "./LessonPage.module.sass";
import {API_URL} from "@/constants";
import ReactPlayer from "react-player";
import HomeworkAddForm from "@/components/UI/Homeworks/HomeworkAddForm/HomeworkAddForm";
import {IHomework} from "@/types";
import HomeworksCard from "@/components/UI/Homeworks/HomeworksCard/HomeworksCard";

const Page = ({ params: { lessonId } }: {params: {lessonId: string}}) => {
    const { user } = useAppSelector(state => state.auth);
    const router = useRouter();
    const [show, setShow] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => CoursesService.getLessonByUser(user._id, lessonId),
        queryKey: ['courseWithProgress'],
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>Error occurred or data is not available</div>;

    const { lesson, homeworks } = data;
    const lessons = lesson?.theme?.lessons ?? [];
    const currentIndex = lessons.findIndex((l:any)=> l._id === lessonId);
    const navigationHandler = (id: string) => router.push(`/mycourses/lesson/${id}`);

    const breadcrumbs = [
        { title: "Курсы", path: "/mycourses" },
        { title: lesson?.course.title, path: `/mycourses/${lesson?.course?._id}` },
        { title: lesson?.title, path: `/mycourses/lesson/${lesson?._id}` },
    ];

    return (
        <>
            <Modal show={show} onHide={() => setShow(!show)} size="lg">
                <Modal.Body>
                    <LessonList
                        lessons={lessons}
                        completedLessonsIds={lesson?.theme?.lessons?.completedLessons}
                        onExit={() => setShow(!show)}
                    />
                </Modal.Body>
            </Modal>
            <div className={styles.lessonPage}>
                <BreadCrumbs breadcrumbs={breadcrumbs} />
                <div className={styles.header}>
                    <h1 className={styles.lessonTitle}>{lesson?.title}</h1>
                    <div>
                        <CustomButton onClick={() => setShow(!show)} color="white">
                            <FontAwesomeIcon icon={faBook} /> Уроки
                        </CustomButton>
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
                <div className={styles.lessonDescription}>
                    <p>
                        {lesson?.description}
                    </p>
                </div>
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
                    lesson?.homework &&
                    <div className={styles.homeworkContainer}>
                        <h1>Задание</h1>
                        {
                            homeworks.length > 0
                            && homeworks.map((homework: IHomework) => <HomeworksCard homework={homework}/>)
                        }
                        {
                            homeworks.length === 0
                            && <HomeworkAddForm lessonId={lessonId} userId={user._id}/>
                        }
                    </div>
                }
            </div>
        </>
    );
};

export default Page;
