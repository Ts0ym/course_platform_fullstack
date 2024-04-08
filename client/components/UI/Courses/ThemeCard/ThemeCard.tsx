import React, {useRef} from 'react';
import {ICourseTheme} from "@/types";
import styles from './ThemeCard.module.sass'
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal, ProgressBar} from "react-bootstrap";
import CreateLessonForm from "@/components/UI/Courses/CreateLessonForm/CreateLessonForm";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";
import {Id} from "react-toastify";
import LessonCard from "@/components/UI/Courses/LessonCard/LessonCard";

interface ThemeCardProps {
    theme: ICourseTheme
}

const ThemeCard = ({ theme } : ThemeCardProps) => {

    const toastId = useRef<Id | undefined>()
    const queryClient = useQueryClient()
    const [showModal, setShowModal] = React.useState(false);
    const [themeTitle, setThemeTitle] = React.useState<string>(theme.title);
    const [themeDescription, setThemeDescription] = React.useState<string>(theme.description)
    const [currentUploadProgress, setCurrentUploadProgress] = React.useState<number>(0)
    const [maxUploadProgress, setMaxUploadProgress] = React.useState<number>(0)
    const [isUploadBarVisible, setIsUploadBarVisible] = React.useState(false)

    const updateUploadProgress = (current: number, max: number) => {
        setCurrentUploadProgress(current)
        setMaxUploadProgress(max)
    }

    const addLessonMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            setIsUploadBarVisible(true)
            formData.append("themeId", theme._id.toString())
            await CoursesService.addLessonToTheme(formData, updateUploadProgress);
        },
        onMutate: () => {
            NotificationsService.showNotification(toastId, "Создание урока...", "info")
        },
        onSuccess: () => {
            NotificationsService.showNotification(toastId, "Урок успешно создан!", "success")
            queryClient.invalidateQueries({queryKey: ['courses']});
            setIsUploadBarVisible(false)
            setShowModal(false)

        },
        onError: (error) => {
            NotificationsService.showNotification(toastId, "Ошибка при создании урока!", "error")
            setIsUploadBarVisible(false)
        },
        mutationKey: ['courses']
    })

    return (
        <>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size='xl'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Создание урока курса</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { isUploadBarVisible
                        && <div>
                            <p>Прогресс загрузки</p>
                            <ProgressBar
                                now={currentUploadProgress}
                                max={maxUploadProgress}
                                label={`${currentUploadProgress}%`}
                            />
                            </div>
                    }
                    <CreateLessonForm onSubmit={(value) => addLessonMutation.mutate(value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отмена
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className={styles.themeCard}>
                <CustomInput
                    placeholder={"Название темы"}
                    value={themeTitle}
                    onChange={(e) => setThemeTitle(e.target.value)}
                    title={"Название темы"}
                    titleShow={true}
                />
                <CustomInput
                    placeholder={"Описание темы"}
                    value={themeDescription}
                    onChange={(e) => setThemeDescription(e.target.value)}
                    title={"Описание темы"}
                    titleShow={true}
                />
                <p className={styles.lessonsTitle}>Уроки темы:</p>
                <div className={styles.themeLessons}>
                    {theme.lessons.length === 0
                        ? <div className={styles.lessonsEmpty}><p>Тут пока пусто...</p></div>
                        : theme.lessons.map((lesson, index) => <LessonCard lesson={lesson} key={index}/>)}
                    <CustomButton onClick={() => {setShowModal(true)}} color={"blue"}><FontAwesomeIcon icon={faPlus}/> Добавить урок к теме</CustomButton>
                </div>
            </div>
        </>
    );
};

export default ThemeCard;