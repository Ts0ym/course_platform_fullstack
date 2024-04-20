import React, {useState} from 'react';
import styles from './CoursesList.module.sass';
import {CoursesService} from "@/services/coursesService";
import {ICourse} from "@/types";
import CoursesCard from "@/components/UI/Courses/CoursesCard/CoursesCard";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import {useQuery} from "@tanstack/react-query";
import {Button, Modal, Spinner} from "react-bootstrap";
import CreateCourseForm from "@/components/UI/Courses/CreateCourseForm/CreateCourseForm";
const CoursesList = () => {

    const [showModal, setShowModal] = useState(false)
    const {data, isLoading} = useQuery({
        queryFn: () => CoursesService.getAllCourses(),
        queryKey: ['courses'],
    })
    const [searchQuery, setSearchQuery] = React.useState('')
    const getFilteredCourses = (courses: ICourse[] | undefined, searchQuery: string) => {
        if (!searchQuery) {return courses}
        if (!courses) {return []}

        const query = searchQuery.toLowerCase();

        return courses.filter(course => {
            const titleMatch = course.title.toLowerCase().includes(query);
            const descriptionMatch = course.description.toLowerCase().includes(query);
            return titleMatch || descriptionMatch;
        });
    }

    const filteredCourses = getFilteredCourses(data, searchQuery);

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создание курса</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateCourseForm/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отмена
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className={styles.coursesList}>
                <div className={styles.controlsContainer}>
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onDeleteClick={() => setSearchQuery('')}
                    />
                    <div>
                        <CustomButton onClick={() => {
                            setShowModal(true)
                        }} color="black"><FontAwesomeIcon icon={faPlus}/> Добавить курс</CustomButton>
                    </div>
                </div>
                {
                    isLoading
                        ? <Spinner animation="border" variant="primary"/>
                        : (filteredCourses && Array.isArray(filteredCourses))
                            ? filteredCourses.map(course => <CoursesCard
                                key={course._id}
                                course={course}/>)
                            : null
                }
            </div>
        </>
    );
};

export default CoursesList;