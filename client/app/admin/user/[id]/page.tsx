'use client'

import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import styles from './UserInfoPage.module.sass';
import BackButton from "@/components/common/BackButton/BackButton";
import {fullUserData} from "@/types";
import InfoContainer from "@/components/common/InfoContainer/InfoContainer";
import AvatarContainer from "@/components/common/AvatarContainer/AvatarContainer";
import UserInfoCourseCard from "@/components/UI/Courses/UserInfoCourseList/UserInfoCourseCard";
import UserInfoCourseList from "@/components/UI/Courses/UserInfoCourseList/UserInfoCourseList";
import AddCourseToUserForm from "@/components/UI/Courses/AddCourseToUserForm/AddCourseToUserForm";
import {UsersService} from "@/services/usersService";

const Page = ({ params }: { params: { id: string } }) => {

    const {id} = params;
    const {data, isLoading, isError} = useQuery<fullUserData>({
        queryFn: () => UsersService.getFullUserInfo(id),
        queryKey: ['fullUserData'],
    })

    console.log(data)
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error!</div>

    return (
        <div className={styles.page}>
            <BackButton/>
            <div className={styles.outerContainer}>
                <div className={styles.leftContainer}>
                    <h1 className={styles.containerTitle}>Информация о пользователе</h1>
                    <div className={styles.avatarSection}>
                        <p>Аватар пользователя</p>
                        <div className={styles.avatarContainer}>
                            <AvatarContainer avatarPath={data?.avatar || ''} border/>
                        </div>
                    </div>
                    <InfoContainer title={"Электронная почта"} content={data?.email || ''}/>
                    <InfoContainer title={"Роль"} content={data?.role || ''}/>
                    <InfoContainer title={"Имя"} content={data?.name || ''}/>
                    <InfoContainer title={"Фамилия"} content={data?.surname || ''}/>
                    <InfoContainer title={"Аккаунт активирован"} content={data?.isActivated === "true" ? "Да" : "Нет"}/>
                    <InfoContainer title={"Баланс аккаунта"} content={data?.balance || ''}/>
                    <InfoContainer title={"Описание аккаунта"} content={data?.aboutMe || ''}/>
                    <InfoContainer title={"Ссылки на социальные сети"} content={data?.socialLinks.join(', ') || ''}/>
                </div>
                <div className={styles.rightContainer}>
                    <h1 className={styles.containerTitle}>Курсы пользователя</h1>
                    <UserInfoCourseList coursesData={data?.coursesWithProgress || []}/>
                    <AddCourseToUserForm
                        currentCoursesIds={
                        data?.coursesWithProgress.map(progress => progress.course._id) || []}
                        userId={id}
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;