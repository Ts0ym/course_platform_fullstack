import React from 'react';
import {IMeetingData} from "@/types";
import styles from './MeetingsList.module.sass';
import MeetingCard from "@/components/UI/Meetings/MeetingCard/MeetingCard";
const MeetingsList = ({meetings} : {meetings: IMeetingData[]}) => {
    return (
        <div className={styles.list}>
            <h1 className={styles.listTitle}>Ваши предстоящие консультации</h1>
            {
                meetings.map(meeting => <MeetingCard meeting={meeting}/>)
            }
        </div>
    );
};

export default MeetingsList;