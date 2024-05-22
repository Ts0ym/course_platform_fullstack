import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import styles from "./CourseTariffList.module.sass";
import TariffsUserCard from "@/components/UI/Tariffs/TariffsUserCard/TariffsUserCard";
import {ITariff} from "@/types";

const CourseTariffList = ({courseId} : {courseId: string}) => {

    const {data: tariffs} = useQuery<ITariff[]>({
        queryFn: async () => CoursesService.getTariffsByCourse(courseId),
        queryKey: ['courseTariffs', courseId],
        placeholderData: [],
        enabled:!!courseId
    })

    const {data: courseData } = useQuery({
        queryFn: async () => CoursesService.getCourseShortInfo(courseId),
        queryKey: ['courseInfo', courseId],
        enabled:!!courseId
    })

    return (
        <div className={styles.listContainer}>
            <h1 className={styles.courseTitle}>{courseData?.title || ''}</h1>
            <h2>{courseData?.description || ''}</h2>
            <div className={styles.list}>
                {tariffs?.map((tariff) => <TariffsUserCard tariff={tariff} key={tariff._id}/>)}
            </div>
        </div>
    );
};

export default CourseTariffList;