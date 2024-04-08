import React from 'react';
import {ICourseTheme} from "@/types";
import styles from './CourseContentThemeCard.module.sass';
import {ProgressBar} from "react-bootstrap";

const CourseContentThemeCard = ({ theme, percentComplete, onClick } : {
    theme: ICourseTheme,
    percentComplete: number
    onClick: () => void
}) => {
    return (
        <div
            className={styles.themeCard}
            onClick={onClick}>
            <h1 className={styles.header}>{theme.title}</h1>
            <div className={styles.progressContainer}>
                <p>{percentComplete}%</p>
                <ProgressBar now={percentComplete}/>
            </div>
        </div>
    );
};

export default CourseContentThemeCard;