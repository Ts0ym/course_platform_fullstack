import React from 'react';
import {IConsultationRequest} from "@/types";
import styles from './ConsultationsUserList.module.sass'
import ConsultationUserCard from "@/components/UI/Consultations/ConsultationUserCard/ConsultationUserCard";

const ConsultationsUserList = ({requests} : {requests: IConsultationRequest[]}) => {
    return (
        <div className={styles.list}>
            {
                requests.map(request => <ConsultationUserCard request={request}/>)
            }
        </div>
    );
};

export default ConsultationsUserList;