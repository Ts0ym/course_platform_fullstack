import React from 'react';
import styles from './CoursesDisplayCard.module.sass';
import {ICourse} from "@/types";
import {API_URL} from "@/constants";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightLong} from "@fortawesome/free-solid-svg-icons";



const CoursesDisplayCard = ({ course, onClick } : {course: ICourse, onClick: () => void}) => {

    return (
            <div className={styles.card} onClick={onClick}>
                <div className={styles.content}>
                    <div className={styles.info}>
                        <h1 className={styles.title}>{course.title}</h1>
                    </div>
                    <div className={styles.descriptionContainer}>
                        <div className={styles.description}>
                            <p>{course.themes.length} тем(ы)</p>
                            <p>{course.themes.reduce((total, theme) => total + theme.lessons.length, 0)} уроков</p>
                        </div>
                        <div className={styles.bottomInfo}>
                            <div className={styles.tags}>
                                {
                                    course.tags.map((tag, index) => (
                                        <div key={index} className={styles.tag}>{tag}</div>
                                    ))
                                }
                            </div>
                            <FontAwesomeIcon icon={faArrowRightLong} className={styles.arrow}/>
                        </div>
                    </div>
                </div>
                <div className={styles.imageContainer}>
                    <Image
                        src={API_URL + "image/" + course.image}
                        alt={"image"}
                        className={styles.courseImage}
                        width={700}
                        height={700}
                        layout="responsive"
                    />
                </div>
            </div>
    );
};

export default CoursesDisplayCard;