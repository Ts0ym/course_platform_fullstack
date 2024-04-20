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
import {faHourglassStart} from "@fortawesome/free-solid-svg-icons";

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

    // Методы для управления редактированием
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
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.homeworkInfo}>
                    <p className={styles.name}>{homework.userId.name}</p>
                    <p className={styles.name}>{homework.userId.surname}</p>
                    <p className={styles.date}>{intlFormatDistance(
                        new Date(homework.sendTime),
                        Date.now(),
                        {locale: 'ru'}
                    )}</p>
                    <div className={styles.controls}>
                        <button className={styles.controls} onClick={handleEdit}>Редактировать</button>
                        <button className={styles.controls} onClick={() => removeHomeworkMutation.mutate()}>Удалить</button>
                    </div>
                </div>
                {isEditing ? (
                    <>
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
                            >Отменить</CustomButton>
                        </div>
                    </>
                ) : (
                    <p className={styles.homeworkContent}>
                        {homework.content}
                    </p>
                )}
            </div>
            <div className={styles.homeworkGrade}>
                {homework.grade === 0 && <p>
                    <FontAwesomeIcon
                        icon={faHourglassStart}
                        className={styles.timeIcon}/>
                    Задание ожидает оценки
                </p>}
            </div>
        </div>
    );
};

export default HomeworksCard;