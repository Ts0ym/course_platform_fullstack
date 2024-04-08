import React from 'react';
import styles from './LessonList.module.sass';
import {ILesson} from "@/types";
import {
    faChevronRight,
    faFileAlt,
    faQuestionCircle,
    faTimes,
    faVideo,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";

const LessonList = ({lessons, completedLessonsIds, onExit} : {
    lessons: ILesson[],
    completedLessonsIds: string[],
    onExit: () => void
}) => {

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'video':
                return faVideo;
            case 'text':
                return faFileAlt;
            case 'quiz':
                return faQuestionCircle;
            default:
                return faQuestionCircle; // Иконка по умолчанию, если тип урока не определен
        }
    };

    const router = useRouter();
    return (
        <div className={styles.lessonList}>

            <button className={styles.closeButton} onClick={() => onExit()}/>

            {
                lessons.map((lesson, index) =>
                    <div
                        className={styles.lessonItem}
                        key={index}
                        onClick={() => router.push(`/mycourses/lesson/${lesson._id}`)}
                    >
                        <div className={styles.infoContainer}>
                            <FontAwesomeIcon
                                icon={getLessonIcon(lesson.type)}
                                className={styles.lessonIcon}/>
                            <p>{lesson.title}</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faChevronRight}/>
                        </div>
                    </div>)
            }
        </div>
    );
};

export default LessonList;