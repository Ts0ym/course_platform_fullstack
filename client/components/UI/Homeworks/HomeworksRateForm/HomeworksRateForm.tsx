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
const HomeworksRateForm = ({ homework, onRateSuccess }: {homework: HomeworkData, onRateSuccess: () => void}) => {

    const [homeworkTextShown, setHomeworkTextShown] = React.useState(false);
    const [homeworkRate, setHomeworkRate] = React.useState(0)
    const [assessmentText, setAssessmentText] = React.useState('');

    const queryClient = useQueryClient()
    const date = parseISO(homework.sendTime); // Преобразование строки в объект Date
    const formattedDate = format(date, "d MMMM 'в' HH:mm", { locale: ru });

    const rateHomeworkMutation = useMutation({
        mutationFn: async ({homeworkId, grade, assessment} : {homeworkId: string, grade: number, assessment: string}) => {
            console.log(grade)
            console.log(assessment)
            return await CoursesService.rateHomework(homeworkId, grade, assessment)
        },
        onSuccess: () => {
            onRateSuccess();
            queryClient.invalidateQueries({queryKey: ['homeworks']})
            NotificationsService.showNotification("Оценка отправлена", "success")
        },
        onError: () => {
            NotificationsService.showNotification("Ошибка при выставлении оценки", "error")
        }
    })

    useEffect(() => {
        setHomeworkRate(0);
        setAssessmentText('');
        setHomeworkTextShown(false);
    }, [homework]);

    const handleTextShown = () => {
        setHomeworkTextShown(!homeworkTextShown)
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
                <div className={styles.contentContainer}>
                    <p>{homework.content}</p>
                </div>
                <div className={styles.studentInfo}>
                    <div className={styles.avatarContainer}>
                        <AvatarContainer avatarPath={homework.userId.avatar}/>
                    </div>
                    <p>{homework.userId.email}</p>
                    <p className={styles.sendDate}>{formattedDate}</p>
                </div>
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
                        placeholder={"Добавьте описание к оценке"}
                        title={"Описание к оценке"}
                        titleShow={true}
                    />
                </div>
                <div className={styles.buttonsContainer}>
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
                </div>
            </div>
        </div>
    );
};

export default HomeworksRateForm;