'use client'
import React, {useEffect, useRef} from 'react';
import {useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import styles from "./CourseInfoPage.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import {Button, Modal} from "react-bootstrap";
import CreateCourseForm from "@/components/UI/Courses/CreateCourseForm/CreateCourseForm";
import {NotificationsService} from "@/services/notificationsService";
import {Id} from "react-toastify";
import {CreateThemeDto} from "@/types";
import ThemeCard from "@/components/UI/Courses/ThemeCard/ThemeCard";

const Page = ({ params }: { params: { id: string } }) => {

    const queryClient = useQueryClient()
    const {data, isLoading, isError} = useQuery({
        queryFn: () => CoursesService.getCourse(params.id),
        queryKey: ['courses'],
    });

    const addThemeMutation = useMutation({
        mutationFn: async (createThemeDto: CreateThemeDto) => {
            await CoursesService.addThemeToCourse(createThemeDto)
        },
        onMutate: () => {
            NotificationsService.showNotification("Создание курса...", "info")
        },
        onSuccess: () => {
            NotificationsService.showNotification("Тема успешно добавлена", "success")
            queryClient.invalidateQueries({queryKey: ['courses']});
            setNewThemeTitle("");
            setNewThemeDescription("");
            setShowModal(false);
        }
    })

    const router = useRouter();
    const [showModal, setShowModal] = React.useState(false);

    const [courseTitle, setCourseTitle] = React.useState('');
    const [courseDescription, setCourseDescription] = React.useState('');

    const [newThemeTitle, setNewThemeTitle] = React.useState("");
    const [newThemeDescription, setNewThemeDescription] = React.useState("");

    console.log(data)

    useEffect(() => {
        if (data) {
            setCourseTitle(data.title);
            setCourseDescription(data.description);
        }
    }, [data]);

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создание темы курса</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomInput
                        placeholder={"Название темы"}
                        value={newThemeTitle}
                        onChange={(e) => setNewThemeTitle(e.target.value)}
                        title={"Добавьте название темы"}
                        titleShow={true}
                    />
                    <CustomInput
                        placeholder={"Описание темы"}
                        value={newThemeDescription}
                        onChange={(e) => setNewThemeDescription(e.target.value)}
                        title={"Добавьте описание темы"}
                        titleShow={true}
                    />
                    <CustomButton onClick={() => { addThemeMutation.mutate({
                        courseId: data?._id ?? "",
                        title: newThemeTitle,
                        description: newThemeDescription
                    })}} color={"blue"}>Добавить тему</CustomButton>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отмена
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className={styles.courseInfoPage}>
                <div className={styles.buttonContainer}>
                    <CustomButton onClick={() => router.back()} color={"blue"}>Назад</CustomButton>
                </div>
                <div className={styles.courseMainInfo}>
                    <div className={styles.courseTitleContainer}>
                        <CustomInput
                            placeholder={""}
                            value={courseTitle ?? ""}
                            onChange={(e) => {setCourseTitle(e.target.value)}}
                            title={"Название курса"}
                            titleShow={true}
                        />
                    </div>

                    <div className={styles.courseDescContainer}>
                        <CustomTextBox
                            value={courseDescription ?? ""}
                            onChange={(e) => {setCourseDescription(e.target.value)}}
                            title={"Описание курса:"}
                            titleShow={true}/>
                    </div>

                    <div className={styles.courseContentContainer}>
                        <p>Содержание курса:</p>
                        <div className={styles.courseContent}>
                            {data?.themes?.length === 0
                                ? <p>Тут пока пусто...</p>
                                : data?.themes?.map((theme) => <ThemeCard theme={theme} key={theme._id}/>)
                            }
                            <CustomButton
                                color={'blue'}
                                onClick={() => {setShowModal(true)}} >
                                <FontAwesomeIcon icon={faPlus}/>
                                Добавить новую тему
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;