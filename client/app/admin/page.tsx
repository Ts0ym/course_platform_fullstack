'use client'

import React, { useState, useEffect } from 'react';
import {Spinner, Tab, Tabs} from "react-bootstrap";
import dynamic from 'next/dynamic';
import useRoleCheck from "@/hooks/useRoleCheck";
import { useAppSelector } from "@/redux/hooks";
import styles from "./AdminPage.module.sass";
import { useQuery } from '@tanstack/react-query';
import {useRouter, useSearchParams} from 'next/navigation';
// import CoursesRequestList from "@/components/UI/Courses/CoursesRequestList/CoursesRequestList";
import ConsultationsAdminPage from "@/components/UI/Consultations/ConsultationsAdminPage/ConsultationsAdminPage";
import ConsultationsRequestsList
    from "@/components/UI/Consultations/ConsultaionsRequestsList/ConsultationsRequestsList";
import AchievementsAdminPage from "@/components/UI/Achievements/AchievementsAdminPage/AchievementsAdminPage";

const CoursesList = dynamic(() => import('@/components/UI/Courses/CoursesList/CoursesList'), {
    loading: () =>
        <div className={styles.spinnerContainer}>
            <Spinner animation="border"/>
        </div>,
    ssr: false
});
const UsersList = dynamic(() => import('@/components/UI/Users/UsersList/UsersList'), {
    loading: () =>
        <div className={styles.spinnerContainer}>
            <Spinner animation="border"/>
        </div>,
    ssr: false
});
const HomeworksList = dynamic(() => import('@/components/UI/Homeworks/HomeworksList/HomeworksList'), {
    loading: () =>
        <div className={styles.spinnerContainer}>
            <Spinner animation="border"/>
        </div>,
    ssr: false
});

const CoursesRequestList = dynamic(() => import('@/components/UI/Courses/CoursesRequestList/CoursesRequestList'), {
    loading: () =>
        <div className={styles.spinnerContainer}>
            <Spinner animation="border"/>
        </div>,
    ssr: false
});

const Page = () => {
    useRoleCheck("admin");
    const user = useAppSelector(state => state.auth.user);
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab')
    const [activeKey, setActiveKey] = useState<string>(tab || 'courses');

    useEffect(() => {
        // Это гарантирует, что вкладка обновляется при изменении URL
        if (tab && tab !== activeKey) {
            setActiveKey(tab);
        }
    }, [tab]);
    const handleSelectTab = (key: string | null) => {
        if (key && key !== activeKey) {
            setActiveKey(key);
            // Формируем URL
            const url = `/admin?tab=${key}`;
            // Вызов router.push с параметром shallow
            router.push(url);
        }
    };

    return (
        <div className={styles.adminPage}>
            <Tabs
                activeKey={activeKey}
                onSelect={handleSelectTab}
                id="controlled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="courses" title={<span className={styles.tabLink}>Курсы</span>} className={styles.tabContent}>
                        {activeKey === 'courses' && <CoursesList />}
                </Tab>
                <Tab eventKey="homeworks" title={<span className={styles.tabLink}>Домашние задания</span>} className={styles.tabContent}>
                    {activeKey === 'homeworks' && <HomeworksList />}
                </Tab>
                <Tab eventKey="users" title={<span className={styles.tabLink}>Пользователи</span>} className={styles.tabContent}>
                   {activeKey === 'users' && <UsersList />}
                </Tab>
                <Tab eventKey="courseRequests" title={<span className={styles.tabLink}>Заявки на обратную связь</span>} className={styles.tabContent}>
                    {activeKey === 'courseRequests' && <CoursesRequestList />}
                </Tab>
                {/*<Tab eventKey="consultationsRequests" title={<span className={styles.tabLink}>Заявки на консультации</span>} className={styles.tabContent}>*/}
                {/*    {activeKey === 'consultationsRequests' && <ConsultationsRequestsList />}*/}
                {/*</Tab>*/}
                {/*<Tab eventKey="consultations" title={<span className={styles.tabLink}>Расписание консультаций</span>} className={styles.tabContent}>*/}
                {/*    {activeKey === 'consultations' && <ConsultationsAdminPage />}*/}
                {/*</Tab>*/}
                <Tab eventKey="achievements" title={<span className={styles.tabLink}>Достижения</span>} className={styles.tabContent}>
                    {activeKey === 'achievements' && <AchievementsAdminPage />}
                </Tab>
            </Tabs>
        </div>
    );
};

export default Page;
