'use client'

import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from "./ProfilePage.module.sass"
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useRouter} from "next/navigation";
import {useAppSelector} from "@/redux/hooks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {UsersService} from "@/services/usersService";
import {IUserInfo, UpdateUserDto} from "@/types";
import AvatarContainer from "@/components/common/AvatarContainer/AvatarContainer";
import {faArrowRight, faArrowRightFromBracket, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import FileUpload from "@/components/common/FileUpload/FileUpload";
import {CoursesService} from "@/services/coursesService";
import {NotificationsService} from "@/services/notificationsService";

const ProfilePage = () => {

    const router = useRouter();
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.auth.user)
    const {data, isPending, error} = useQuery<IUserInfo>({
        queryFn: async () => UsersService.getUserById(user?._id),
        queryKey: ['userInfo'],
    })

    const updateUserMutation = useMutation({
        mutationFn: async (dto: UpdateUserDto) => {
            await UsersService.updateUser(user._id, dto)
        },
        onMutate: () => {

        },
        onSuccess: () => {
            NotificationsService.showNotification("Профиль успешно обновлен", "success")
            return queryClient.invalidateQueries({queryKey: ['userInfo']});
        }
    })

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [socialLinks, setSocialLinks] = useState<string[]>([]);
    const [socialLink, setSocialLink] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);

    // Обновление состояний при получении данных
    useEffect(() => {
        if (data) {
            setEmail(data.email || '');
            setName(data.name || '');
            setSurname(data.surname || '');
            setSocialLink(''); // Пример со ссылкой на Facebook
            setAboutMe(data.aboutMe || '');
            setSocialLinks(data.socialLinks || []);
        }
    }, [data]);

    const onUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setAvatar(file)
            }
        }
    }

    const onUploadCancel = () => {
        setAvatar(null);
    }

    const addSocialLink = () => {
        if (socialLink && !socialLinks.includes(socialLink) && socialLinks.length < 5) {
            setSocialLinks(prevLinks => [...prevLinks, socialLink]);
            setSocialLink('');
        }
    };

    const deleteSocialLink = (link: string) => {
        setSocialLinks(prevLinks => prevLinks.filter(l => l !== link));
    };

    const onSaveButtonClick = () => {
        console.log(socialLinks)
        const data:UpdateUserDto = {
            email,
            name,
            surname,
            socialLinks,
            aboutMe
        }
        if(avatar){
            data['avatar'] = avatar
        }
        updateUserMutation.mutate(data)
    }

    return (
        <div className={styles.page}>
            <div className={styles.controlsContainer}>
                <div>
                    <CustomButton onClick={() => router.back()} color="white" outline>
                        Назад
                    </CustomButton>
                </div>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.infoSection}>
                    <div className={styles.userInfoContainer}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className={styles.exitIcon} onClick={() => {}}/>
                        <div className={styles.imageContainer}>
                            <AvatarContainer avatarPath={data?.avatar || ''} border/>
                        </div>
                        <p>{email}</p>
                        <p>{name} {surname}</p>
                    </div>
                </div>
                <div className={styles.editSection}>
                    <h1>Редактирование профиля</h1>
                    <div className={styles.inputs}>
                        <div className={styles.leftContainer}>
                            <CustomInput
                                placeholder="Эл. почта"
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                title="Эл. почта"
                            />
                            <h2>Профиль</h2>
                            <CustomInput
                                placeholder="Имя"
                                onChange={e => setName(e.target.value)}
                                value={name}
                                title="Имя"
                            />
                            <CustomInput
                                placeholder="Фамилия"
                                onChange={e => setSurname(e.target.value)}
                                value={surname}
                                title="Фамилия"
                            />
                            <h2>Социальные сети</h2>
                            {socialLinks.map((link, index) => (
                                <div key={index} className={styles.socialLinkCard}>
                                    <p>{link}</p>
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        onClick={() => deleteSocialLink(link)}
                                        className={styles.deleteLinkIcon}
                                    />
                                </div>
                            ))}
                            <div className={styles.addSocialLink}>
                                <CustomInput
                                    placeholder="Добавьте ссылку"
                                    onChange={e => setSocialLink(e.target.value)}
                                    value={socialLink}
                                />
                                <div className={styles.addSocialLinkButton}>
                                    <CustomButton
                                        onClick={() => addSocialLink()}
                                        color="white"
                                        outline
                                    >
                                        <FontAwesomeIcon icon={faArrowRight}/>
                                    </CustomButton>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightContainer}>
                            <h2>Описание профиля</h2>
                            <CustomTextBox
                                value={aboutMe}
                                onChange={e => setAboutMe(e.target.value)}
                                placeholder="Описание профиля"
                                title="О себе"
                            />
                            <h2>Аватар</h2>
                            <FileUpload
                                onFileSelect={onUploadChange}
                                onFileDelete={onUploadCancel}
                                fileValue={avatar}
                                title="Изменить аватар"
                            />
                        </div>
                    </div>
                    <div className={styles.saveButtonContainer}>
                        <CustomButton onClick={()=> onSaveButtonClick()} color="black">Сохранить</CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProfilePage;