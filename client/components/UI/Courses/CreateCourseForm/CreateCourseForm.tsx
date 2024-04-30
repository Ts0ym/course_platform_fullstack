'use client'
import React, {ChangeEvent, FormEvent, useRef, useState} from 'react';
import {Id} from "react-toastify";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import FileUploader from "@/components/common/FileUpload/FileUpload";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faXmark} from "@fortawesome/free-solid-svg-icons";
import styles from './CreateCourseForm.module.sass'

export interface CourseFormData {
    title: string
    description: string
    image: File | null;
}

const CreateCourseForm = () => {

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            await CoursesService.createCourse(formData);
        },
        onMutate: () => {
            NotificationsService.showNotification( "Создание курса...", "info")
        },
        onSuccess: () => {
            NotificationsService.showNotification("Курс успешно создан!", "success")
            queryClient.invalidateQueries({queryKey: ['courses']});
            setFormData({
                title: '',
                description: '',
                image: null
            })
        },
        onError: (error) => {
            NotificationsService.showNotification( "Ошибка при создании курса!", "error")
        },
        mutationKey: ['courses']
    })

    const [formData, setFormData] = useState<CourseFormData>({
        title: '',
        description: '',
        image: null
    });
    const [tags, setTags] = useState<string[]>([])
    const [tagInputValue, setTagInputValue] = useState('')

    const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value as string | Blob);
        });
        formDataToSend.append('tags', JSON.stringify(tags));
        mutation.mutate(formDataToSend, {
        });
    }

    const onFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }

    const onUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setFormData(prevFormData => ({ ...prevFormData, image: file }));
            }
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags([...tags.filter(tag => tag !== tagToRemove)]);
    };

    const addTag = () => {
        if(tags.includes(tagInputValue)) return;
        setTags([...tags, tagInputValue]);
        setTagInputValue('');
    }

    return (
        <div>
            <form onSubmit={onFormSubmit} encType="multipart/form-data">
                <CustomInput
                    placeholder={"Название курса"}
                    value={formData.title}
                    onChange={onFormChange}
                    name={"title"}
                    title={"Добавте название курса"}
                    titleShow={true}
                    />
                <CustomInput
                    placeholder={"Описание курса"}
                    value={formData.description}
                    onChange={onFormChange}
                    name={"description"}
                    title={"Добавте описание курса"}
                    titleShow={true}
                />
                <FileUploader
                    onFileSelect={onUploadChange}
                    onFileDelete={() => {setFormData(prevFormData => ({ ...prevFormData, image: null }));}}
                    fileValue={formData.image}
                    title={"Добавте обложку курса"}
                    titleShow={true}
                />
                <div className={styles.tagsContainer}>
                    {tags.map(tag => (
                        <div key={tag} className={styles.tag}>
                            <p>{tag}</p>
                            <FontAwesomeIcon
                                icon={faXmark}
                                onClick={() => removeTag(tag)}/>
                        </div>
                    ))}
                </div>
                <div className={styles.tagInput}>
                    <div className={styles.inputContainer}>
                        <CustomInput
                            placeholder={"Название тэга"}
                            value={tagInputValue}
                            onChange={e => setTagInputValue(e.target.value)}
                            title={'Добавить тэг'}
                            titleShow={true}
                        />
                    </div>
                    <div className={styles.addTagButtonContainer}>
                        <CustomButton
                            onClick={addTag}
                            color={'white'}
                            outline
                        ><FontAwesomeIcon
                            icon={faArrowRight}/></CustomButton>
                    </div>
                </div>
                <CustomButton
                    type="submit" color={"black"}
                    onClick={() => {}}>Создать курс</CustomButton>
            </form>
        </div>
    );
};

export default CreateCourseForm;