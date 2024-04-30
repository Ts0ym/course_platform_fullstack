import React, {useRef} from 'react';
import {ICourseTheme} from "@/types";
import styles from './ThemeCard.module.sass'
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFaceSadTear, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal, ProgressBar} from "react-bootstrap";
import CreateLessonForm from "@/components/UI/Courses/CreateLessonForm/CreateLessonForm";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";
import {Id} from "react-toastify";
import LessonCard from "@/components/UI/Courses/LessonCard/LessonCard";
import EmptyPlaceholder from "@/components/common/EmptyPlaceholder/EmptyPlaceholder";

interface ThemeCardProps {
    theme: ICourseTheme
}

const ThemeCard = ({ theme } : ThemeCardProps) => {

    const queryClient = useQueryClient()
    const [showModal, setShowModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
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
            NotificationsService.showNotification("Создание урока...", "info")
        },
        onSuccess: () => {
            NotificationsService.showNotification( "Урок успешно создан!", "success")
            queryClient.invalidateQueries({queryKey: ['courses']});
            setIsUploadBarVisible(false)
            setShowModal(false)

        },
        onError: (error) => {
            NotificationsService.showNotification( "Ошибка при создании урока!", "error")
            setIsUploadBarVisible(false)
        },
        mutationKey: ['courses']
    })

    const deleteThemeMutation = useMutation({
        mutationFn: async (themeId: string) => {
            await CoursesService.deleteTheme(themeId)
        },
        onSuccess: () => {
            NotificationsService.showNotification( "Тема успешно удалена!", "success")
            queryClient.invalidateQueries({queryKey: ['courses']});
        },
        onError: (error) => {
            NotificationsService.showNotification( "Ошибка при создании урока!", "error")
        },
        mutationKey: ['courses']
    })

    return (
        <>
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                size='lg'
            >
                <Modal.Body>
                    Вы уверены, что хотите тему "{theme.title}"? (Действие нельзя отменить)
                </Modal.Body>
                <Modal.Footer>
                    <CustomButton onClick={() => setShowDeleteModal(false)} color="white" outline>Отмена</CustomButton>
                    <CustomButton onClick={() => deleteThemeMutation.mutate(theme._id.toString())} color="red" outline>Удалить</CustomButton>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size='xl'
            >
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
                        ? <EmptyPlaceholder/>
                        : theme.lessons.map((lesson, index) => <LessonCard lesson={lesson} key={index}/>)}
                    <div className={styles.buttonContainer}>
                        <CustomButton
                            onClick={() => {setShowModal(true)}}
                            color={"white"}
                            outline
                        ><FontAwesomeIcon
                            icon={faPlus}/> Добавить урок к теме</CustomButton>
                        <CustomButton
                            onClick={() => setShowDeleteModal(true)}
                            color={"red"}
                            outline
                        ><FontAwesomeIcon
                            icon={faTrash}/> Удалить тему</CustomButton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ThemeCard;