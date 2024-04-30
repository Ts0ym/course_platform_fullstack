import React from 'react';
import {ICourse, ICourseProgress, ILesson} from "@/types";
import styles from './LastCourseCard.module.sass';
import ProgressCircle from "@/components/common/ProgressCircle/ProgressCircle";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {API_URL} from "@/constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/navigation";
import {getCourseProgress} from "@/utils/coursesDataUtils";
import Image from "next/image";

export interface LastCourseData {
    course: ICourse
    progress: ICourseProgress,
    lesson: ILesson
}

const LastCourseCard = ({ course, progress, lesson } : LastCourseData) => {
    const router = useRouter();

    if (course === undefined || progress === undefined) return null;

    return (
        <div className={styles.lastCourseCard} onClick={() => router.push(`/mycourses/${course._id}`)}>
            <div className={styles.courseInfo}>
                <h1 className={styles.title}>{course.title}</h1>
                <div className={styles.progressInfoContainer}>
                    <div className={styles.progressCircleContainer}>
                        <ProgressCircle
                            percent={getCourseProgress(course, progress)}
                            isPercentVisible={false}/>
                    </div>
                    <div className={styles.progressInfo}>
                        <h2>{getCourseProgress(course, progress) + "%"}</h2>
                        <p>Прогресс продвижения</p>
                    </div>
                </div>
                <p className={styles.buttonHeader}>Продолжай с урока,<br></br> на котором остановился</p>
                <div className={styles.buttonContainer}>
                    <CustomButton
                        onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/mycourses/lesson/${lesson?._id}`)
                        }}
                        color={"black"}>Продолжить  <FontAwesomeIcon icon={faArrowRight}/>
                    </CustomButton>
                </div>
            </div>
            <div className={styles.imageContainer}>
                <Image
                    src={API_URL + "image/" + course.image}
                    alt={"image"}
                    className={styles.courseImage}
                    width={400}
                    height={400}
                />
            </div>
        </div>
    );
};

export default LastCourseCard;