'use client'

import React, {useState} from 'react';
import {useAppSelector} from "@/redux/hooks";
import {useRouter} from "next/navigation";
import styles from "./BugReport.module.sass"
import CustomButton from "@/components/common/CustomButton/CustomButton";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import CustomRadioButtons from "@/components/common/CustomRadioButtons/CustomRadioButtons";
import CustomSelect from "@/components/common/CustomSelect/CustomSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import {useMutation} from "@tanstack/react-query";
import {IBugReportData} from "@/types";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";
import BackButton from "@/components/common/BackButton/BackButton";



const Page = () => {

    const user = useAppSelector(state => state.auth.user);
    const router = useRouter();
    const [email, setEmail] = useState<string>(user?.email)
    const [description, setDescription] = useState<string>('');
    const [severity, setSeverity] = useState<number>(1);
    const [isFormSended, setIsFormSended] = useState<boolean>(false)

    const sendBugReportMutaton = useMutation({
        mutationFn: async(data: IBugReportData) => {
            await CoursesService.createBugReport(data)
        },
        onMutate: () => {

        },
        onSuccess: () => {
            // NotificationsService.showNotification("Ошибка при отправке баг-репорта", 'error')
            setIsFormSended(true)
        },
        onError: (error) => {
            NotificationsService.showNotification("Ошибка при отправке баг-репорта", 'error')
        }
    })

    const severityValues = [
        {
            value: 1,
            label: 'Низкий'
        },
        {
            value: 2,
            label: 'Средний'
        },
        {
            value: 3,
            label: 'Высокий'
        }]

    const refreshForm = () => {
        setEmail(user?.email)
        setDescription('')
        setSeverity(1)
        setIsFormSended(false)
    }

    return (
        <div className={styles.page}>
            <BackButton/>
            {
                !isFormSended ?
                <div className={styles.formContainer}>
                    <div className={styles.form}>
                        <FontAwesomeIcon icon={faBug}  className={styles.icon}/>
                        <h1>Сообщить о проблеме</h1>
                        <CustomInput
                            placeholder="Введите ваш email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            title="Электронная почта"
                            titleShow={true}
                            type={"email"}
                            id={"email"}
                        />
                        <CustomSelect
                            value={severity}
                            onChange={e => setSeverity(Number(e.target.value))}
                            title={"Оцените серьезность проблемы"}
                            titleShow
                            options={severityValues}
                        />
                        <CustomTextBox
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder={"Опишите вашу проблему"}
                            title="Описание проблемы"
                            titleShow={true}
                            id={"description"}
                        />
                        <div>
                            <CustomButton
                                onClick={() => sendBugReportMutaton.mutate({
                                    email,
                                    description,
                                    severity
                                })}
                                color={"black"}>Сообщить о проблеме
                            </CustomButton>
                        </div>
                    </div>
                </div>
                    :
                <div className={styles.successContainer}>
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        className={styles.successIcon}
                    />
                    <h1>Ваше сообщение отправлено</h1>
                    <div>
                        <CustomButton
                            color={"black"}
                            onClick={() => refreshForm()}
                        >Отправить еще</CustomButton>
                    </div>
                </div>
            }
        </div>
    );
};

export default Page;