import React from 'react';
import styles from './ConsultationUserCard.module.sass';
import {IConsultationRequest} from "@/types";
import {GetFormatDateTimeRange, GetFormattedDate} from "@/utils/timeUtils";

const ConsultationUserCard = ({ request } : {request: IConsultationRequest}) => {

    let statusBadge
    switch(request.status) {
        case "approved":
            if(new Date(request.startTime) > new Date()){
                statusBadge = <p className={styles.approvedBadge}>Подтверждена</p>
            }else{
                statusBadge = <p className={styles.approvedBadge}>Завершена</p>
            }
            break;

        case "rejected":
            statusBadge = <p className={styles.rejectedBadge}>Отменена</p>
            break;

        case "pending":
            statusBadge = <p className={styles.pendingBadge}>Ожидает подтверждения</p>
            break;

        default:
            statusBadge = <p className={styles.pendingBadge}>Ожидает подтверждения</p>
            break;
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <p>{GetFormatDateTimeRange(new Date(request.startTime), new Date(request.endTime))}</p>
                {statusBadge}
            </div>
        </div>
    );
};

export default ConsultationUserCard;