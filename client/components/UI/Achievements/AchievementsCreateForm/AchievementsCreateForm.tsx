'use client';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsService } from '@/services/notificationsService';
import CustomInput from '@/components/common/CustomInput/CustomInput';
import FileUploader from '@/components/common/FileUpload/FileUpload';
import CustomButton from '@/components/common/CustomButton/CustomButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './AchievementsCreateForm.module.sass';
import {AchievementService} from "@/services/achievementsService";

export interface AchievementFormData {
    title: string;
    description: string;
    condition: string;
    image: File | null;
}

const CreateAchievementForm = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            await AchievementService.createAchievement(formData);
        },
        onMutate: () => {
            NotificationsService.showNotification('Создание достижения...', 'info');
        },
        onSuccess: () => {
            NotificationsService.showNotification('Достижение успешно создано!', 'success');
            queryClient.invalidateQueries({ queryKey: ['achievements'] });
            setFormData({
                title: '',
                description: '',
                condition: '',
                image: null,
            });
        },
        onError: (error) => {
            NotificationsService.showNotification('Ошибка при создании достижения!', 'error');
        },
        mutationKey: ['achievements'],
    });

    const [formData, setFormData] = useState<AchievementFormData>({
        title: '',
        description: '',
        condition: '',
        image: null,
    });

    const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value as string | Blob);
        });
        mutation.mutate(formDataToSend, {});
    };

    const onFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const onUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setFormData((prevFormData) => ({ ...prevFormData, image: file }));
            }
        }
    };

    return (
        <div>
            <form onSubmit={onFormSubmit} encType="multipart/form-data">
    <CustomInput
        placeholder={"Название достижения"}
    value={formData.title}
    onChange={onFormChange}
    name={"title"}
    title={"Добавте название достижения"}
    titleShow={true}
    />
    <CustomInput
    placeholder={"Описание достижения"}
    value={formData.description}
    onChange={onFormChange}
    name={"description"}
    title={"Добавте описание достижения"}
    titleShow={true}
    />
    <CustomInput
    placeholder={"Условие получения"}
    value={formData.condition}
    onChange={onFormChange}
    name={"condition"}
    title={"Добавте условие получения"}
    titleShow={true}
    />
    <FileUploader
    onFileSelect={onUploadChange}
    onFileDelete={() => { setFormData((prevFormData) => ({ ...prevFormData, image: null })); }}
    fileValue={formData.image}
    title={"Добавте иконку достижения"}
    titleShow={true}
    />
    <div className={styles.buttonContainer}>
        <CustomButton type="submit" color={"black"} onClick={() => { }}>Создать достижение</CustomButton>
    </div>
    </form>
    </div>
);
};

export default CreateAchievementForm;