import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styles from './CoursesList.module.sass';
import { CoursesService } from "@/services/coursesService";
import CoursesCard from "@/components/UI/Courses/CoursesCard/CoursesCard";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useQuery } from "@tanstack/react-query";
import { Modal, Spinner } from "react-bootstrap";
const CreateCourseForm = dynamic(() => import('@/components/UI/Courses/CreateCourseForm/CreateCourseForm'), { ssr: false });

const CoursesList = () => {
    const [showModal, setShowModal] = useState(false);
    const { data, isLoading } = useQuery({
        queryFn: CoursesService.getAllCourses,
        queryKey: ['courses'],
    });
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = useMemo(() => {
        if (!searchQuery) return data;
        const lowerQuery = searchQuery.toLowerCase();
        return data?.filter(course => course.title.toLowerCase().includes(lowerQuery) || course.description.toLowerCase().includes(lowerQuery)) || [];
    }, [data, searchQuery]);

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создание курса</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateCourseForm />
                </Modal.Body>
                <Modal.Footer>
                    <CustomButton onClick={() => setShowModal(false)} color="white" outline>Отмена</CustomButton>
                </Modal.Footer>
            </Modal>

            <div className={styles.coursesList}>
                <div className={styles.controlsContainer}>
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onDeleteClick={() => setSearchQuery('')}
                    />
                    <div><CustomButton onClick={() => setShowModal(true)} color="black">
                        <FontAwesomeIcon icon={faPlus} /> Добавить курс
                    </CustomButton></div>
                </div>
                <div className={styles.coursesListContainer}>
                    {isLoading && Array.isArray(filteredCourses)? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        Array.isArray(filteredCourses) && filteredCourses?.map(course => (
                            <CoursesCard key={course._id} course={course} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default CoursesList;
