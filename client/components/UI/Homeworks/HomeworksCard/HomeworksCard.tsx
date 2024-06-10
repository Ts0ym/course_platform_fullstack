import React, { useState } from 'react';
import {IHomework} from "@/types";
import styles from "./HomeworksCard.module.sass";
import { intlFormatDistance } from "date-fns"
import {useMutation} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";
import {useQueryClient} from "@tanstack/react-query";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faHammer, faHourglassStart, faStar} from "@fortawesome/free-solid-svg-icons";
import AvatarContainer from "@/components/common/AvatarContainer/AvatarContainer";
import {format} from "date-fns";
import {ru} from "date-fns/locale";

const HomeworksCard = ({ homework } : { homework: IHomework}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(homework.content);

    const queryClient = useQueryClient();
    const removeHomeworkMutation = useMutation({
        mutationFn: async () => {
            await CoursesService.deleteHomework(homework._id);
        },
        onSuccess: () => {
            NotificationsService.showNotification("Задание удалено", "success");
            queryClient.invalidateQueries({queryKey: ['courseWithProgress']});
        }
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedContent(homework.content); // Сброс содержимого на оригинальное
    };

    const handleSave = async () => {
        // Вызов API для сохранения измененного содержимого
        await CoursesService.updateHomework(homework._id, { content: editedContent });
        setIsEditing(false);
        NotificationsService.showNotification("Задание обновлено", "success");
        queryClient.invalidateQueries({queryKey: ['courseWithProgress']});
    };

    return (
        <div className={styles.card}>
            <div className={styles.userPicture}>
                <AvatarContainer avatarPath={homework?.userId?.avatar || ''} border/>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.homeworkInfo}>
                    <p className={styles.name}>{homework.userId.name}</p>
                    <p className={styles.name}>{homework.userId.surname}</p>
                    <p className={styles.date}>{format(homework.sendTime, "d MMMM 'в' HH:mm", { locale: ru })}</p>
                    {
                        homework.status === "submitted" &&
                        <div className={styles.controls}>
                            <button className={styles.controls} onClick={handleEdit}>Редактировать</button>
                            <button className={styles.controls} onClick={() => removeHomeworkMutation.mutate()}>Удалить</button>
                        </div>
                    }
                </div>
                {isEditing ? (
                    <div className={styles.editContainer}>
                        <CustomTextBox
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            placeholder={"Добавьте текст ответа"}
                        />
                        <div className={styles.buttonsContainer}>
                            <CustomButton
                                onClick={handleSave}
                                color={"black"}
                            >Сохранить</CustomButton>
                            <CustomButton
                                onClick={handleCancel}
                                color={"white"}
                                outline
                            >Отменить</CustomButton>
                        </div>
                    </div>
                ) : (
                    <p className={styles.homeworkContent}>
                        {homework.content}
                    </p>
                )}
                {
                    homework.assessment !== '' && homework.status !== "submitted"
                    &&  <div className={styles.assessment}>
                            Комментарий преподавателя
                            <p>{homework.assessment}</p>
                        </div>
                }
            </div>
            <div className={styles.homeworkGrade}>
                {homework.status === "submitted"
                    &&
                <p className={styles.unratedSign}>
                    Задание ожидает оценки
                    <FontAwesomeIcon
                        icon={faHourglassStart}
                        className={styles.icon}/>
                </p>
                }
                {
                    homework.status === 'graded' &&
                    <>
                        <p className={styles.ratedSign}>
                            Задание оценено
                            <FontAwesomeIcon icon={faCircleCheck} className={styles.icon}/>
                        </p>
                        <p className={styles.grade}>
                            Оценка куратора {homework.grade} <FontAwesomeIcon icon={faStar} className={styles.starIcon}/>
                        </p>
                    </>
                }
                {
                    homework.status === "returned"
                    &&
                    <p className={styles.returnedSign}>
                        Отправлено на доработку
                        <FontAwesomeIcon icon={faHammer} className={styles.icon}/>
                    </p>
                }
            </div>
        </div>
    );
};

export default HomeworksCard;