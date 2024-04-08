'use client'
import React from 'react';
import useRoleCheck from "@/hooks/useRoleCheck";
import {useAppSelector} from "@/redux/hooks";
import {useRouter} from "next/navigation";
import {Tab, Tabs} from "react-bootstrap";
import styles from "./AdminPage.module.sass"
import CoursesList from "@/components/UI/Courses/CoursesList/CoursesList";
import UsersList from "@/components/UI/Users/UsersList/UsersList";

const Page = () => {

    useRoleCheck("admin")
    const user = useAppSelector(store => store.auth.user)
    const router = useRouter()

    return (
        <div className={styles.adminPage}>
            <Tabs
                defaultActiveKey="courses"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="courses" title="Курсы">
                    <CoursesList/>
                </Tab>
                <Tab eventKey="homeworks" title="Домашние задания">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="users" title="Пользователи">
                    <UsersList/>
                </Tab>
                <Tab eventKey="reports" title="Обращения">
                    Tab content for Contact
                </Tab>
            </Tabs>
        </div>
    );
};

export default Page;