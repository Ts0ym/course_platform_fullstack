'use client'

import React, {ChangeEvent, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import styles from "./CourseInfoPage.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faFloppyDisk, faPen, faPlus} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import {Modal} from "react-bootstrap";
import {NotificationsService} from "@/services/notificationsService";
import {CreateThemeDto, UpdateCourseDto} from "@/types";
import ThemeCard from "@/components/UI/Courses/ThemeCard/ThemeCard";
import Image from "next/image";
import {API_URL} from "@/constants";
import FileUpload from "@/components/common/FileUpload/FileUpload";
import TariffsList from "@/components/UI/Tariffs/TariffsList/TariffsList";
import TariffCreateForm from "@/components/UI/Tariffs/TariffCreateForm/TariffCreateForm";

const Page = ({ params }: { params: { id: string } }) => {

    const {id} = params;
    const queryClient = useQueryClient()
    const {data, isLoading, isError} = useQuery({
        queryFn: () => CoursesService.getCourse(id),
        queryKey: ['courses'],
    });

    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [newThemeTitle, setNewThemeTitle] = useState("");
    const [newThemeDescription, setNewThemeDescription] = useState("");
    const [newImage, setNewImage] = useState<File | null>();
    const [isImageEdit, setIsImageEdit] = useState(false);
    const [changesMade, setChangesMade] = useState(false);
    const [showTariffsForm, setShowTariffsForm] = useState(false);

    const addThemeMutation = useMutation({
        mutationFn: async (createThemeDto: CreateThemeDto) => {
            await CoursesService.addThemeToCourse(createThemeDto)
        },
        onMutate: () => {
            NotificationsService.showNotification("Создание курса...", "info")
        },
        onSuccess: () => {
            NotificationsService.showNotification("Тема успешно добавлена", "success")
            setNewThemeTitle("");
            setNewThemeDescription("");
            setShowModal(false);
            return queryClient.invalidateQueries({queryKey: ['courses']});
        }
    })

    const updateCourseMutation = useMutation({
        mutationFn: async (dto: UpdateCourseDto)=> {
            await CoursesService.updateCourse(id, dto)
        },
        onMutate: () => {

        },
        onSuccess: () => {
            NotificationsService.showNotification("Курс успешно обновлен", "success")
            return queryClient.invalidateQueries({queryKey: ['courses']});
        }
    })

    console.log(data)

    useEffect(() => {
        if (data) {
            setCourseTitle(data.title);
            setCourseDescription(data.description);
        }
    }, [data]);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCourseTitle(e.target.value);
        setChangesMade(true);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCourseDescription(e.target.value);
        setChangesMade(true);
    };

    const onUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setNewImage(file)
                setChangesMade(true);
            }
        }
    }

    const onUploadCancel = () => {
        setIsImageEdit(false)
        setNewImage(null)
    }

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
                    <CustomTextBox placeholder={"Описание темы"}
                                   value={newThemeDescription}
                                   onChange={(e) => setNewThemeDescription(e.target.value)}
                                   title={"Добавьте описание темы"}
                                   titleShow={true}/>
                    <CustomButton onClick={() => { addThemeMutation.mutate({
                        courseId: data?._id ?? "",
                        title: newThemeTitle,
                        description: newThemeDescription
                    })}} color={"black"}>Добавить тему</CustomButton>
                </Modal.Body>
            </Modal>
            <Modal show={showTariffsForm} onHide={() => setShowTariffsForm(false)}>
                <Modal.Body>
                    <TariffCreateForm courseId={data?._id?? ""} onSubmit={() => setShowTariffsForm(false)}/>
                </Modal.Body>
            </Modal>
            <div className={styles.courseInfoPage}>
                <div className={styles.buttonContainer}>
                    <div>
                        <CustomButton
                            onClick={() => router.back()}
                            color={"white"}
                            outline
                        > <FontAwesomeIcon icon={faChevronLeft} className={styles.icon}/> Назад
                        </CustomButton>
                    </div>
                    {
                        changesMade &&
                        <div>
                            <CustomButton
                                onClick={() => {
                                    const dto: UpdateCourseDto= {
                                        title: courseTitle,
                                        description: courseDescription,
                                    };

                                    if (newImage) {
                                        dto.image = newImage;
                                    }
                                    updateCourseMutation.mutate(dto)
                                }}
                                color={"black"}
                            ><FontAwesomeIcon icon={faFloppyDisk}/>Сохранить</CustomButton>
                        </div>
                    }
                </div>
                <div className={styles.courseMainInfo}>
                    <div className={styles.courseImageContainer}>
                        <div>
                            <p>Обложка курса</p>
                            <div className={styles.courseImage}>
                                {
                                    data?.image &&
                                    <Image
                                        src={API_URL + "image/" + data?.image}
                                        alt={"image"}
                                        width={700}
                                        height={700}
                                        layout="responsive"
                                    />
                                }
                            </div>
                        </div>
                        <div className={styles.uploadFileContainer}>
                            {
                             isImageEdit
                                 ?
                                 <>
                                     <FileUpload
                                         onFileSelect={onUploadChange}
                                         onFileDelete={() => {setNewImage(null)}}
                                         fileValue={newImage || null}
                                         title={"Добавьте новую обложку"}
                                     />
                                     <CustomButton onClick={onUploadCancel} color={'red'} outline>Отмена</CustomButton>
                                 </>
                                 :
                                 <div className={styles.enableEditImageButton}>
                                     <CustomButton
                                         onClick={e => setIsImageEdit(true)}
                                         color={"white"}>
                                         <FontAwesomeIcon icon={faPen}/>
                                     </CustomButton>
                                 </div>
                            }
                        </div>
                    </div>
                    <div className={styles.tariffsContainer}>
                        <h1>Тарифы курса</h1>
                        <TariffsList tariffs={data?.tariffs?? []}/>
                        <div className={styles.addButtonContainer}>
                            <CustomButton
                                onClick={() => setShowTariffsForm(true)}
                                color={"black"}
                            >
                                <FontAwesomeIcon icon={faPlus}/>
                                Создать тариф
                            </CustomButton>
                        </div>
                    </div>
                    <div className={styles.courseTitleContainer}>
                        <CustomInput
                            placeholder={""}
                            value={courseTitle ?? ""}
                            onChange={(e) => {handleTitleChange(e)}}
                            title={"Название курса"}
                            titleShow={true}
                        />
                    </div>

                    <div className={styles.courseDescContainer}>
                        <CustomTextBox
                            value={courseDescription ?? ""}
                            onChange={(e) => {handleDescriptionChange}}
                            title={"Описание курса:"}
                            titleShow={true}/>
                    </div>

                    <div className={styles.courseContentContainer}>
                        <p className={styles.containerTitle}>Содержание курса:</p>
                        <div className={styles.courseContent}>
                            {data?.themes?.length === 0
                                ? <p>Тут пока пусто...</p>
                                : data?.themes?.map((theme) => <ThemeCard theme={theme} key={theme._id}/>)
                            }
                            <div className={styles.addThemeBtnContainer}>
                                <CustomButton
                                    color={'black'}
                                    onClick={() => {setShowModal(true)}} >
                                    <FontAwesomeIcon icon={faPlus}/>
                                    Добавить новую тему
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;