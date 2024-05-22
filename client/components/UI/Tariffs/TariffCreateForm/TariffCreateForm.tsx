import React from 'react';
import styles from './TariffCreateForm.module.sass';
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";

const TariffCreateForm = ({courseId, onSubmit} : {courseId: string, onSubmit: () => void}) => {
    const queryClient = useQueryClient();
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [price, setPrice] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [freeConsultations, setFreeConsultations] = React.useState(0);

    const addTariffMutation = useMutation({
        mutationFn: async () => CoursesService.createTariff({
            duration,
            name,
            description,
            price,
            freeConsultations,
            course: courseId
        }),
        onSuccess: () => {
            NotificationsService.showNotification("Тариф добавлен", "success")
            queryClient.invalidateQueries({queryKey: ['courses']});
            onSubmit();
        }
    })
    return (
        <div className={styles.form}>
            <CustomInput
                placeholder={"Название тарифа"}
                value={name}
                onChange={e => setName(e.target.value)}
                title={"Название тарифа"}
            />
            <CustomInput
                placeholder={"Описание тарифа"}
                value={description}
                onChange={e => setDescription(e.target.value)}
                title={"Описание тарифа"}
            />
            <CustomInput
                placeholder={"Цена тарифа"}
                value={price}
                onChange={e => setPrice(parseInt(e.target.value))}
                title={"Стоимость тарифа"}
                type={"number"}
            />
            <CustomInput
                placeholder={"Длительность тарифа"}
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
                title={"Длительность тарифа"}
                type={"number"}
            />
            <CustomInput
                placeholder={"Количество бесплатных консультаций тарифа"}
                value={freeConsultations}
                onChange={e => setFreeConsultations(parseInt(e.target.value))}
                title={"Количество бесплатных консультаций тарифа"}
                type={"number"}
            />
            <CustomButton onClick={() => addTariffMutation.mutate()} color={"black"}>Создать тариф</CustomButton>
        </div>
    );
};

export default TariffCreateForm;