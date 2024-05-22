import React from 'react';
import {CoursesWithProgress} from "@/types";
import styles from "./UserInfoCourseList.module.sass"
import ProgressCircle from "@/components/common/ProgressCircle/ProgressCircle";
import {GetFormattedDate} from "@/utils/timeUtils";

const UserInfoCourseCard = ({data}: {data: CoursesWithProgress}) => {

    const completedPercentage = data.progress.toFixed(0)

    return (
        <div className={styles.card}>
            <div className={styles.courseTitle}>
                <h1>{data.course.title}</h1>
                <p>({data.tariff.name})</p>
            </div>
            <div className={styles.info}>
                <p className={styles.date}>Дата прикрепления: {GetFormattedDate(data.startDate)}</p>
                <div className={styles.progress}>
                    <p>Процент прохождения {completedPercentage}%</p>
                    <div className={styles.progressCircle}>
                        <ProgressCircle percent={parseInt(completedPercentage)}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCourseCard;