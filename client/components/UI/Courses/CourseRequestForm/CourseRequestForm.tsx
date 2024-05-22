import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import styles from './CourseRequestForm.module.sass';
import {Spinner} from "react-bootstrap";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import Link from "next/link";
import {NotificationsService} from "@/services/notificationsService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import {faTelegram, faWhatsapp} from "@fortawesome/free-brands-svg-icons";

const CourseRequestForm = ({courseId} : {courseId: string}) => {

    const {data: courseInfo, isSuccess} = useQuery({
        queryFn: async () => CoursesService.getCourseShortInfo(courseId),
        queryKey: ['courseInfo', courseId],
    })
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [userPhoneNumber, setUserPhoneNumber] = useState('')
    const [comment, setComment] = useState('')
    const [isSended, setIsSended] = useState(false)
    const sendRequestMutation = useMutation({
        mutationFn: async () => {
            return CoursesService.createCourseRequest({
                course: courseId,
                userName: userName,
                userEmail: email,
                userPhone: userPhoneNumber,
                comment: comment,
                sendTime: new Date()
            })
        },
        onSuccess: () => {
            // NotificationsService.showNotification("Запрос принят",'success')
            setIsSended(true)
        },
        onError: (error) => {
            NotificationsService.showNotification("Ошибка при отправке запроса", 'error')
        }
    })
    useEffect(() => {
        setIsSended(false)
        setComment('')
    }, [courseId]);

    if(!isSuccess) return <Spinner animation="border" />

    return (
        <div className={styles.form}>
            {
                !isSended ?
                    <>
                        <h1>{courseInfo?.title}</h1>
                        <h2>Чтобы мы могли дать вам доступ к курсу, пожалуйста заполните контактные данные </h2>
                        <CustomInput
                            placeholder={"Ваш Email"}
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            type={"email"}
                        />
                        <CustomInput
                            placeholder={"Ваше имя"}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <CustomInput
                            placeholder={"Ваш номер телефона"}
                            value={userPhoneNumber}
                            onChange={e => setUserPhoneNumber(e.target.value)}
                        />
                        <CustomTextBox
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            title={"Добавьте комментарий, если необходимо"}
                            placeholder={"Комментарий"}
                        />
                        <p className={styles.warning}>
                            Нажимая кнопку, я даю{' '}
                            <span>согласие на обработку моих персональных данных</span>
                        </p>
                        <CustomButton onClick={() => sendRequestMutation.mutate()} color={"black"}>Получить доступ</CustomButton>
                        <Link href="/" className={styles.supportLink}>Не загружается? Напишите нам, мы поможем</Link>
                    </>
                    :
                    <>
                        <FontAwesomeIcon icon={faCircleCheck} className={styles.successIcon}/>
                        <h1>Мы получили вашу заявку!</h1>
                        <h1>Что дальше?</h1>
                        <h2 className={styles.whatsNext}>Скоро с вами свяжется менеджер по телефону или в мессенджере</h2>
                        <h1>Не хотите ждать?</h1>
                        <h2 className={styles.whatsNext}>Позвоните нам или напишите в мессенджер</h2>
                        <div className={styles.contactsContainer}>
                            <div className={styles.phoneContainer}>
                                <h2>8(999)999-99-99</h2>
                                <p>Звонок по России бесплатный</p>
                            </div>
                            <div className={styles.messengersContainer}>
                                <div className={styles.messenger}>
                                    <FontAwesomeIcon icon={faTelegram} className={styles.telegramIcon}/>
                                    <p>Написать в Telegram</p>
                                </div>
                                <div className={styles.messenger}>
                                    <FontAwesomeIcon icon={faWhatsapp} className={styles.watsappIcon}/>
                                    <p>Написать в WatsApp</p>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    );
};

export default CourseRequestForm;