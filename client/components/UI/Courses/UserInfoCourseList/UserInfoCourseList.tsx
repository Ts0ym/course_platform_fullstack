import React from 'react';
import styles from './UserInfoCourseList.module.sass';
import {CoursesWithProgress} from "@/types";
import UserInfoCourseCard from "@/components/UI/Courses/UserInfoCourseList/UserInfoCourseCard";

const UserInfoCourseList = ({coursesData}: {coursesData: CoursesWithProgress[]}) => {
    return (
        <div className={styles.list}>
            {
                coursesData.length > 0
                    ? coursesData.map((course, index) =>
                        <UserInfoCourseCard
                            data={course}
                            key={index}/>)
                    : <p>У данного пользователя пока нет курсов</p>
            }
        </div>
    );
};

export default UserInfoCourseList;