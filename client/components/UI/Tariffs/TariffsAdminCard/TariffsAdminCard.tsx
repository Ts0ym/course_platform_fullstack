import React from 'react';
import {ITariff} from "@/types";
import styles from './TariffsAdminCard.module.sass';
import InfoContainer from "@/components/common/InfoContainer/InfoContainer";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";

const TariffsAdminCard = ({tariff} : {tariff: ITariff}) => {
    const queryClient = useQueryClient();
    const deleteTariffMutation = useMutation({
        mutationFn: async () => CoursesService.deleteTariff(tariff._id),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['courses']})
    })
    return (
        <div className={styles.card}>
            <InfoContainer title={"Название тарифа"} content={tariff.name}/>
            <InfoContainer title={"Описание тарифа"} content={tariff.description}/>
            <InfoContainer title={"Длительность тарифа"} content={tariff.duration.toString()}/>
            <InfoContainer title={"Бесплатные консультации"} content={tariff.freeConsultations.toString()}/>
            <InfoContainer title={"Цена тарифа"} content={tariff.price.toString()}/>
            <CustomButton onClick={() => deleteTariffMutation.mutate()} color={"red"} outline>Удалить</CustomButton>
        </div>
    );
};

export default TariffsAdminCard;