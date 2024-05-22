import React from 'react';
import {useAppSelector} from "@/redux/hooks";
import styles from './CreateConsultationRequestForm.module.sass';
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useMutation} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";


const CreateConsultationRequestForm = () => {
    const user = useAppSelector(store => store.auth.user)
    const [comment, setComment] = React.useState('')
    const [startTime, setStartTime] = React.useState<Date>()
    const [endTime, setEndTime] = React.useState<Date>()
    const sendRequestMutation = useMutation({
        mutationFn: async () => {
            await CoursesService.createConsultationRequest({
                endTime: endTime ? new Date(endTime.getTime() + endTime.getTimezoneOffset() * 60000) : new Date(),
                startTime: startTime ? new Date(startTime.getTime() + startTime.getTimezoneOffset() * 60000) : new Date(),
                comment,
                user: user._id,
                requestDate: new Date(),
                status: "pending"
            })
        },
        onError: () => console.log("error"),
        onSuccess: () => {
            NotificationsService.showNotification( "Заявка успешно отправлена", "success")
        }
    })

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const date = new Date(value); // Преобразуем строку в объект Date
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Преобразуем к местному времени
        setStartTime(localDate);

        // Установка endDate на час больше startDate
        const newEndDate = new Date(localDate.getTime() + 60 * 60 * 1000);
        setEndTime(newEndDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const date = new Date(value); // Преобразуем строку в объект Date
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Преобразуем к местному времени
        setEndTime(localDate);

        // Проверка, чтобы нельзя было установить endDate перед startDate
        if (startTime && localDate < startTime) {
            setStartTime(localDate);
        }
    };

    return (
        <div className={styles.formContainer}>
            <CustomTextBox
                title={'Комментарий к заявке'}
                value={comment}
                placeholder={'Добавьте комментарий к заявке'}
                onChange={e => setComment(e.target.value)}/>
            <CustomInput
                placeholder={''}
                value={startTime ? startTime.toISOString().slice(0, 16) : ''}
                onChange={handleStartDateChange}
                type={'datetime-local'}
                title={'Укажите удобное время начала консультации'}
            />
            <CustomInput
                placeholder={''}
                value={endTime ? endTime.toISOString().slice(0, 16) : ''}
                onChange={handleEndDateChange}
                type={'datetime-local'}
                title={'Укажите удобное время конца консультации'}
            />
            <CustomButton
                onClick={() => sendRequestMutation.mutate()}
                color={'black'}>
                Отправить заявку
            </CustomButton>
        </div>
    );
};

export default CreateConsultationRequestForm;