import React from 'react';
import styles from './HomeworkAddForm.module.sass';
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";

const HomeworkAddForm = ({lessonId, userId} : {lessonId: string, userId: string}) => {

    const [textBoxValue, setTextBoxValue] = React.useState('');
    const queryClient = useQueryClient();
    const addHomeworkMutation = useMutation({
        mutationFn: async () => {
            await CoursesService.addHomeworkToLesson({lessonId, content: textBoxValue, userId, sendTime: new Date()});
        },
        onSuccess: () => {
            NotificationsService.showNotification("Задание отправлено", "success")
            queryClient.invalidateQueries({queryKey: ['courseWithProgress']})
        }
    })

    return (
        <div className={styles.homeworkAddForm}>
            <CustomTextBox
                value={textBoxValue}
                onChange={e => setTextBoxValue(e.target.value)}
                placeholder="Добавьте ответ на задание"
            />
            <div className={styles.buttonContainer}>
                {textBoxValue !== ''
                    && <CustomButton
                        onClick={() => addHomeworkMutation.mutate()}
                        color={"black"}>Отправить</CustomButton>}
            </div>
        </div>
    );
};

export default HomeworkAddForm;