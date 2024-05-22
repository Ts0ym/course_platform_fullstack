import React from 'react';
import {IConsultationRequest} from "@/types";
import styles from './ConsultationsRequestsCard.module.sass';
import {GetFormattedDate} from "@/utils/timeUtils";

const ConsultationsRequestsCard = ({request, onClick} : {request: IConsultationRequest, onClick?: () => void}) => {
    return (
        <div className={styles.card} onClick={onClick}>
            <p>{request.user.email}</p>
            <p>{request.user.name} {request.user.surname}</p>
            <p>{GetFormattedDate(request.requestDate)}</p>
            <p>{GetFormattedDate(request.startTime)}</p>
            <p>{GetFormattedDate(request.endTime)}</p>
        </div>
    );
};

export default ConsultationsRequestsCard;