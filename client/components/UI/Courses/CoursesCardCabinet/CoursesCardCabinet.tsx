import React from 'react';
import styles from './CoursesCardCabinet.module.sass';
import {ICourse} from "@/types";
import {API_URL} from "@/constants";

const CoursesCardCabinet = ({ course, onClick} : {course: ICourse, onClick?: () => void}) => {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h1 className={styles.title}>{course.title}</h1>
                    <p>{course.themes.length} тем(ы)</p>
                    <p>{course.themes.reduce((total, theme) => total + theme.lessons.length, 0)} уроков</p>
                </div>
                <div className={styles.tags}>
                    {
                        course.tags.map((tag, index) => (
                            <div key={index} className={styles.tag}>{tag}</div>
                        ))
                    }
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

export default CoursesCardCabinet;