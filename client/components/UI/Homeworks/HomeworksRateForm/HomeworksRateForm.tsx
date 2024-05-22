'use client'

import React, {useEffect} from 'react';
import styles from './HomeworksRateForm.module.sass';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {HomeworkData} from "@/components/UI/Homeworks/HomeworksList/HomeworksList";
import {intlFormatDistance, format, parseISO } from "date-fns";
import AvatarContainer from "@/components/common/AvatarContainer/AvatarContainer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faStar} from "@fortawesome/free-solid-svg-icons";
import {ru} from "date-fns/locale";
import CustomRatingStars from "@/components/common/CustomRatingStars/CustomRatingStars";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";
import {useAppSelector} from "@/redux/hooks";
import HomeworkContent from "@/components/UI/Homeworks/HomeworkContent/HomeworkContent";
const HomeworksRateForm = ({ homework, onRateSuccess}: {homework: HomeworkData, onRateSuccess: () => void}) => {

    const [homeworkTextShown, setHomeworkTextShown] = React.useState(false);
    const [homeworkRate, setHomeworkRate] = React.useState(homework.grade || 0);
    const [assessmentText, setAssessmentText] = React.useState(homework.assessment || '');
    const user = useAppSelector(data => data.auth.user);

    const queryClient = useQueryClient()
    const date = parseISO(homework.sendTime); // Преобразование строки в объект Date

    const {data: homeworkHistory} = useQuery<HomeworkData[]>({
        queryFn: async () => CoursesService.getHomeworkHistory(homework.lessonId._id, user._id, homework._id),
        queryKey: ['homeworks', homework],
    })

    const rateHomeworkMutation = useMutation({
        mutationFn: async ({homeworkId, grade, assessment} : {homeworkId: string, grade: number, assessment: string}) => {
            console.log(grade)
            console.log(assessment)
            return await CoursesService.rateHomework(homeworkId, grade, assessment)
        },
        onSuccess: () => {
            onRateSuccess();
            queryClient.invalidateQueries({queryKey: ['homeworks']})
            NotificationsService.showNotification("Оценка выствлена", "success")
        },
        onError: () => {
            NotificationsService.showNotification("Ошибка при выставлении оценки", "error")
        }
    })

    const returnHomeworkMutation = useMutation({
        mutationFn: async ({homeworkId, assessment} : {homeworkId: string, assessment: string}) => {
            return await CoursesService.requestRevision(homeworkId, assessment)
        },
        onSuccess: () => {
            onRateSuccess();
            queryClient.invalidateQueries({queryKey: ['homeworks']})
            NotificationsService.showNotification("Работа отправлена на доработку", "success")
        },
        onError: () => {
            NotificationsService.showNotification("Ошибка отправке на доработку", "error")
        }
    })

    useEffect(() => {
        if(homework.grade!== undefined && homework.grade!== null) {
            setHomeworkRate(homework.grade);
        }
        if (homework.assessment !== undefined && homework.assessment!== null) {
            setAssessmentText(homework.assessment);
        }else{
            setAssessmentText('');
        }
        setHomeworkTextShown(false);
    }, [homework]);

    const handleTextShown = () => {
        setHomeworkTextShown(!homeworkTextShown)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }


    return (
        <div className={styles.form}>
            <div className={styles.sideInfo}>
                <div className={styles.infoContainer}>
                    <h1>
                        Когда сдано
                    </h1>
                    <p>
                        {intlFormatDistance(
                            new Date(homework.sendTime),
                            Date.now(),
                            {locale: 'ru'}
                        )}
                    </p>
                </div>
                <div className={styles.infoContainer}>
                    <h1>
                        Студент
                    </h1>
                    <div className={styles.userDataContainer}>
                        <div className={styles.avatarContainer}>
                            <AvatarContainer avatarPath={homework.userId.avatar}/>
                        </div>
                        <div className={styles.userInfoContainer}>
                            <p>{homework.userId.email}</p>
                            <p className={styles.nameContainer}>{`${homework.userId.name} ${homework.userId.surname}`}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.mainInfo}>
                <h1 className={styles.title}>
                    {homework.lessonId.title}
                </h1>
                {
                    homework.status === "returned" &&
                    <p className={styles.returnWarning}>Это задание было отправлено на доработку</p>
                }
                <p className={styles.showTextButton} onClick={handleTextShown}>
                    {
                        homeworkTextShown
                            ? <>Скрыть текст задания <FontAwesomeIcon icon={faChevronUp} className={styles.icon}/></>
                            : <>Показать текст задания <FontAwesomeIcon icon={faChevronDown} className={styles.icon}/></>
                    }
                </p>
                {
                    homeworkTextShown &&
                    <p className={styles.homeworkText}>
                        {homework.lessonId.homeworkText}
                    </p>
                }
                {
                    Array.isArray(homeworkHistory) && homeworkHistory.length > 0 &&
                    <>
                        <p className={styles.homeworksTitle}>Прошлые версии задания:</p>
                        {homeworkHistory.reverse().map((homework, index) =>
                            <HomeworkContent
                                content={homework.content}
                                sendTime={homework.sendTime}
                                user={homework.userId}
                                key={index}
                            />)}
                    </>
                }
                <p className={styles.homeworksTitle}>Последняя версия задания:</p>
                <HomeworkContent
                    content={homework.content}
                    sendTime={homework.sendTime}
                    user={homework.userId}
                />

                <div className={styles.rateContainer}>
                    <h1>Оцените ответ студента</h1>
                </div>
                <CustomRatingStars
                    title={"Оценка за задание"}
                    totalStars={5}
                    rating={homeworkRate}
                    onRatingChange={(value) => setHomeworkRate(value)}
                />
                <div className={styles.assessmentContainer}>
                    <CustomTextBox
                        value={assessmentText}
                        onChange={e => setAssessmentText(e.target.value)}
                        placeholder={"Добавьте комментарий к оценке"}
                        title={"Комментарий к оценке"}
                        titleShow={true}
                    />
                </div>
                <div className={styles.buttonsContainer}>
                    <div className={styles.leftButtons}>
                        <div>
                            <CustomButton
                                onClick={() => {
                                    rateHomeworkMutation.mutate({
                                        homeworkId: homework._id,
                                        grade: homeworkRate,
                                        assessment: assessmentText
                                    })
                                }}
                                color={"black"}
                            >Выставить оценку</CustomButton>
                        </div>
                        {
                            homework.status === "submitted" &&
                            <div>
                                <CustomButton
                                    onClick={() => {
                                        returnHomeworkMutation.mutate({
                                            homeworkId: homework._id,
                                            assessment: assessmentText
                                        })
                                    }}
                                    color={"red"}
                                    outline
                                >Отправить на доработку</CustomButton>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeworksRateForm;