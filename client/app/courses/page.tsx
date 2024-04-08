'use client'
import React from 'react';
import styles from './CoursesPage.module.sass';
import {CoursesService} from "@/services/coursesService";
import CoursesDisplayCard from "@/components/UI/Courses/CoursesDisplayCard/CoursesDisplayCard";
import {Spinner} from "react-bootstrap";
import {useQuery} from "@tanstack/react-query";


const Page = () => {

    const {data, isLoading, isError} = useQuery({
        queryFn: () => CoursesService.getAllCourses(),
        queryKey: ['courses'],
    })

    const courses = data;

    return (
        <div className={styles.coursesPage}>
            <div className={styles.coursesTitle}>
                <p>Доступные курсы</p>
            </div>
            <div className={styles.coursesListContainer}>
                <div className={styles.coursesList}>
                    {
                        isLoading
                            ? <Spinner animation="border" variant="primary"/>
                            : (courses && Array.isArray(courses))
                                ? courses.map(course => <CoursesDisplayCard key={course._id} course={course}/>)
                                : null                }
                </div>
            </div>
        </div>
    );
};

export default Page;