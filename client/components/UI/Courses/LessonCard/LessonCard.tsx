import React, {useRef} from 'react';
import { ILesson, LessonType } from "@/types"; // Предполагается, что типы уже определены
import styles from './LessonCard.module.sass';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileAlt, faPen, faQuestionCircle, faTrash, faVideo} from "@fortawesome/free-solid-svg-icons";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {Id} from "react-toastify";
import {NotificationsService} from "@/services/notificationsService";

interface LessonCardProps {
    lesson: ILesson;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {

    const queryClient = useQueryClient();

    const deleteLessonMutation = useMutation({
        mutationFn: async () => {
            await CoursesService.deleteLesson(lesson._id);
        },
        onSuccess: () => {
            NotificationsService.showNotification( "Урок удален", "success")
            queryClient.invalidateQueries({queryKey: ['courses']});
        }
    })
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

    return (
        <div className={styles.lessonCard}>
            <div className={styles.lessonInfo}>
                <FontAwesomeIcon icon={getLessonIcon(lesson.type)} className={styles.lessonIcon} />
                <p className={styles.lessonTitle}>{lesson.title}</p>
            </div>
            <div className={styles.controlsContainer}>
                <FontAwesomeIcon
                    icon={faPen}
                    className={styles.lessonEdit}
                />
                <FontAwesomeIcon
                    icon={faTrash}
                    className={styles.lessonDelete}
                    onClick={() => deleteLessonMutation.mutate()}
                />
            </div>
        </div>
    );
};

export default LessonCard;

