import React from 'react';
import {ITariff} from "@/types";
import styles from './TariffsList.module.sass';
import TariffsAdminCard from "@/components/UI/Tariffs/TariffsAdminCard/TariffsAdminCard";

const TariffsList = ({tariffs} : {tariffs: ITariff[]}) => {
    return (
        <div className={styles.list}>
            {tariffs.map(tariff => <TariffsAdminCard tariff={tariff} key={tariff._id}/>)}
        </div>
    );
};

export default TariffsList;