import React, {FC, useRef} from 'react';
import styles from './CoursesCard.module.sass';
import {ICourse} from "@/types";
import {API_URL} from "@/constants";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {Button, Modal} from "react-bootstrap";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {useRouter} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faList} from "@fortawesome/free-solid-svg-icons";
import {Id} from "react-toastify";
import {NotificationsService} from "@/services/notificationsService";
import Image from "next/image";

export interface CourseCardProps {
    course: ICourse;
}

const CoursesCard: FC<CourseCardProps> = ({ course }) => {

    const [showModal, setShowModal] = React.useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await CoursesService.deleteCourse(id);
        },
        mutationKey: ['courses'],
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['courses']});
            NotificationsService.showNotification( "Курс успешно удален!", "success")

        }
    })

    const getAmountOfLessons = () => {
        let amount = 0;
        for(const theme of course.themes) {
            amount += theme.lessons.length;
        }
        return amount;
    }

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body>Удалить курс "{course.title}"? (Это действие нельзя отменить)</Modal.Body>
                <Modal.Footer>
                    <CustomButton color={"white"} outline onClick={() => setShowModal(false)}>
                        Отмена
                    </CustomButton>
                    <CustomButton color={"red"} outline onClick={() => {
                        setShowModal(false)
                        deleteMutation.mutate(course._id)
                    }}>
                        Удалить
                    </CustomButton>

                </Modal.Footer>
            </Modal>
            <div className={styles.courseCard}>
                <div className={styles.courseImage}>
                    <Image src={API_URL + "image/" + course.image} alt={"image"} width={200} height={200}/>
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.courseInfo}>
                        <h1>{course.title}</h1>
                        <div className={styles.description}>
                            <p><FontAwesomeIcon icon={faList}/>{` Темы: ${course.themes.length}`}</p>
                            <p><FontAwesomeIcon icon={faFile}/>{` Уроки: ${getAmountOfLessons()}`}</p>
                        </div>
                    </div>
                    <div className={styles.courseButtons}>
                        <CustomButton onClick={() => router.push(`admin/courses/edit/${course._id}`)} color={"white"} outline>Редактировать</CustomButton>
                        <CustomButton onClick={() => setShowModal(true)} color={"red"} outline>Удалить</CustomButton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoursesCard;