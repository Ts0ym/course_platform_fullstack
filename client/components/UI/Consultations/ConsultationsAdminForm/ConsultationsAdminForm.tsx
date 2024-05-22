import React from 'react';
import styles from './ConsultationsAdminForm.module.sass';
import {IConsultationRequest} from "@/types";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import InfoContainer from "@/components/common/InfoContainer/InfoContainer";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";

const ConsultationsAdminForm = ({request, onSuccess} : {request: IConsultationRequest | null, onSuccess: () => void}) => {
    if(!request) return null
    const queryClient = useQueryClient()
    const initaialStartTime = new Date(request.startTime)
    initaialStartTime.setMinutes(initaialStartTime.getMinutes() - initaialStartTime.getTimezoneOffset());
    const initaialEndTime = new Date(request.endTime)
    initaialEndTime.setMinutes(initaialEndTime.getMinutes() - initaialEndTime.getTimezoneOffset());
    const [startTime, setStartTime] = React.useState<Date>(initaialStartTime);
    const [endTime, setEndTime] = React.useState<Date>(initaialEndTime)

    const approveConsultationMutation = useMutation({
        mutationFn: async () => CoursesService.approveConsultationRequest(
            request._id || '',
            startTime === initaialStartTime ? startTime : new Date(startTime.getTime() + startTime.getTimezoneOffset() * 60000),
            endTime === initaialEndTime ? endTime : new Date(endTime.getTime() + endTime.getTimezoneOffset() * 60000)
        ),
        onSuccess: () => {
            NotificationsService.showNotification("Успешно подтверждено", 'success')
            onSuccess()
            queryClient.invalidateQueries({queryKey: ["pendingConsultationRequests"]})
        }
    })

    const rejectConsultationMutation = useMutation({
        mutationFn: async () => CoursesService.rejectConsultationRequest(request._id || ''),
        onSuccess: () => {
            NotificationsService.showNotification("Успешно отклонено", 'success')
            onSuccess()
            queryClient.invalidateQueries({queryKey: ["pendingConsultationRequests"]})
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
        <div className={styles.form}>
            <InfoContainer
                title={"Комментарий пользователя"}
                content={request.comment || ''}
            />
            <InfoContainer
                title={"Имя пользователя"}
                content={`${request.user?.name} ${request.user?.surname}` || ''}
            />
            <InfoContainer
                title={"Email пользователя"}
                content={request.user?.email || ''}
            />
            <CustomInput
                placeholder={''}
                value={startTime ? startTime.toISOString().slice(0, 16) : ''}
                onChange={handleStartDateChange}
                type={'datetime-local'}
                title={'Время начала консультации'}
            />
            <CustomInput
                placeholder={''}
                value={endTime ? endTime.toISOString().slice(0, 16) : ''}
                onChange={handleEndDateChange}
                type={'datetime-local'}
                title={'Время конца консультации'}
            />
            <div className={styles.buttonsContainer}>
                <CustomButton
                    onClick={() => approveConsultationMutation.mutate()}
                    color={'black'}
                >Принять заявку</CustomButton>
                <CustomButton
                    onClick={() => {}}
                    color={"red"}
                    outline
                >Отклонить заявку</CustomButton>
            </div>
        </div>
    );
};

export default ConsultationsAdminForm;