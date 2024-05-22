import React from 'react';
import {HomeworkData} from "@/components/UI/Homeworks/HomeworksList/HomeworksList";
import styles from "./HomeworkAdminCard.module.sass"
import { intlFormatDistance } from "date-fns"
import AvatarContainer from "@/components/common/AvatarContainer/AvatarContainer";
import {GetFormattedTimeFromString} from "@/utils/timeUtils";

const HomeworkAdminCard = ({ data, onClick } : { data: HomeworkData, onClick: () => void}) => {
    return (
        <div className={styles.card} onClick={onClick}>
            <p>{GetFormattedTimeFromString(data.sendTime)}</p>
            <p>{data.lessonId?.title}</p>
            <p>{data.lessonId?.themeId?.title}</p>
            <div className={styles.userDataContainer}>
                <div className={styles.avatarContainer}>
                    <AvatarContainer avatarPath={data.userId.avatar}/>
                </div>
                <div className={styles.userInfoContainer}>
                    <p className={styles.nameContainer}>{`${data?.userId?.name} ${data?.userId?.surname}`}</p>
                    <p>{data?.userId?.email}</p>
                </div>
            </div>
            <p>{data?.lessonId?.themeId?.courseId?.title}</p>
        </div>
    );
};

export default HomeworkAdminCard;