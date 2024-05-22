import React from 'react';
import {IMeetingData} from "@/types";
import styles from './MeetingCard.module.sass';
import {GetFormatDateTimeRange, GetFormattedDate} from "@/utils/timeUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faTrash} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/components/common/CustomButton/CustomButton";

const MeetingCard = ({ meeting } : { meeting: IMeetingData }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h1>{meeting.name}</h1>
                <p>Создано: {GetFormattedDate(meeting.createTime)}</p>
            </div>
            <p><FontAwesomeIcon icon={faCalendarDays} className={styles.icon}/>{GetFormatDateTimeRange(new Date(meeting.startTime), new Date(meeting.endTime))}</p>
            <p>Ссылка на конференцию:
                <a
                    href={meeting.join_url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.joinLink}
                >
                    {meeting.inviteeUri}
                </a>
            </p>
            <p>Пароль для подключения: {meeting.password}</p>
            <div className={styles.buttonContainer}>
                <a href={meeting.cancel_url} target="_blank" rel="noopener noreferrer">
                    <CustomButton onClick={() => {}} color={"white"} outline><FontAwesomeIcon icon={faTrash}/>Отменить запись</CustomButton>
                </a>
            </div>
        </div>
    );
};

export default MeetingCard;