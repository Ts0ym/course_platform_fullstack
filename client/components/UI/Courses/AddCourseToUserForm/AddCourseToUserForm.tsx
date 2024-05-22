import React, {useEffect, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import styles from "./AddCourseToUserForm.module.sass";
import CustomSelect from "@/components/common/CustomSelect/CustomSelect";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {UsersService} from "@/services/usersService";
import {NotificationsService} from "@/services/notificationsService";
import {ICourse, ITariff} from "@/types";

const AddCourseToUserForm = ({ currentCoursesIds, userId }: { currentCoursesIds: string[], userId: string }) => {
    const [selectedCourse, setSelectedCourse] = useState<string | undefined>('');
    const [selectedTariff, setSelectedTariff] = useState<string | undefined>('');
    const [tariffs, setTariffs] = useState([]);
    const queryClient = useQueryClient();

    // Запрос всех курсов
    // const { data: courses, isLoading: isLoadingCourses } = useQuery(['courses'], CoursesService.getAllCourses);
    const {data: courses, isLoading: isLoadingCourses} = useQuery({
        queryFn: () => CoursesService.getAllCourses(),
        queryKey: ['courses'],
    })
    // Запрос тарифов для выбранного курса
    useEffect(() => {
        if (selectedCourse) {
            const fetchTariffs = async () => {
                const tariffs = await CoursesService.getTariffsByCourse(selectedCourse);
                setTariffs(tariffs);
                setSelectedTariff(undefined); // Сброс выбранного тарифа при смене курса
            };
            fetchTariffs();
        }
    }, [selectedCourse]);

    // Мутация для регистрации пользователя на курс с выбранным тарифом
    const enrollUserMutation = useMutation({
        mutationFn: (dto: { userId: string, courseId: string, tariffId: string }) => UsersService.enrollUser(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['fullUserData']});
            NotificationsService.showNotification("Курс успешно прикреплён к пользователю!", "success");
        },
        onError: () => {
            NotificationsService.showNotification("Ошибка при прикреплении курса", "error");
        }
    });

    if (isLoadingCourses) {
        return <div>Loading courses...</div>;
    }

    // Фильтрация курсов, на которые пользователь уже записан
    const filteredCourses = courses?.filter((course: ICourse) => !currentCoursesIds.includes(course._id)) || [];
    const courseOptions = [{ value: '', label: 'Выберите курс' }, ...filteredCourses.map((course: any) => ({ value: course._id, label: course.title }))];

    return (
        <div className={styles.form}>
            {filteredCourses.length !== 0 && (
                <>
                    <h1>Прикрепить курс к пользователю</h1>
                    <CustomSelect
                        value={selectedCourse}
                        options={courseOptions}
                        onChange={e => setSelectedCourse(e.target.value)}
                        title="Выберите курс" />
                    {selectedCourse && (
                        <>
                            <CustomSelect
                                value={selectedTariff}
                                options={[{ value: '', label: 'Выберите тариф' }, ...tariffs.map((tariff: ITariff) => ({ value: tariff._id, label: tariff.name }))]}
                                onChange={e => setSelectedTariff(e.target.value)}
                                title="Выберите тариф" />
                            <CustomButton
                                onClick={() => selectedTariff && enrollUserMutation.mutate({ userId: userId, courseId: selectedCourse, tariffId: selectedTariff })}
                                color="black"
                                disabled={!selectedTariff}>
                                <FontAwesomeIcon icon={faPlus} /> Прикрепить курс
                            </CustomButton>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default AddCourseToUserForm;