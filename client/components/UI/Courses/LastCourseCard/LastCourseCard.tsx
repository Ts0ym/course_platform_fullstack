import React from 'react';
import {ICourse} from "@/types";
import styles from './LastCourseCard.module.sass';
import ProgressCircle from "@/components/common/ProgressCircle/ProgressCircle";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {API_URL} from "@/constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

export interface LastCourseData {
    course: ICourse
    progress: {
        _id: string
        user: string
        course: string
        completedLessons: string[]
    }
}

const LastCourseCard = ({ course, progress } : LastCourseData) => {
    // console.log(progress.completedLessons.length);
    const getCourseProgress = () => {
        try{
            const totalLessons = course.themes.reduce((total, theme) => total + theme.lessons.length, 0)
            const completedLessons = progress.completedLessons.length
            return (completedLessons / totalLessons) * 100
        }catch (e) {
            return 0
        }
    }
    if (course === undefined || progress === undefined) return null;

    return (
        <div className={styles.lastCourseCard}>
            <div className={styles.courseInfo}>
                <h1 className={styles.title}>{course.title}</h1>
                <div className={styles.progressInfoContainer}>
                    <div className={styles.progressCircleContainer}>
                        <ProgressCircle
                            percent={getCourseProgress()}
                            isPercentVisible={false}/>
                    </div>
                    <div className={styles.progressInfo}>
                        <h2>{getCourseProgress() + "%"}</h2>
                        <p>Прогресс продвижения</p>
                    </div>
                </div>
                <p className={styles.buttonHeader}>Продолжай с урока,<br></br> на котором остановился</p>
                <div className={styles.buttonContainer}>
                    <CustomButton
                        onClick={() => {}}
                        color={"black"}>Продолжить  <FontAwesomeIcon icon={faArrowRight}/>
                    </CustomButton>
                </div>
            </div>
            <div className={styles.imageContainer}>
                <img
                    src={API_URL + "image/" + course.image}
                    alt={"image"}
                    className={styles.courseImage}
                />
            </div>
        </div>
    );
};

export default LastCourseCard;