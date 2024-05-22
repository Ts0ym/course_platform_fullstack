import React from 'react';
import styles from './CourseRequestCard.module.sass';
import {ICourseRequest} from "@/types";
import {intlFormatDistance, parseISO} from "date-fns";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";

const CourseRequestCard = ({request} : {request: ICourseRequest}) => {

    const queryClient = useQueryClient()
    const markAsCheckedMutation = useMutation({
        mutationFn: () => CoursesService.markRequestAsChecked(request._id || ''),
        onSuccess: () => queryClient.invalidateQueries({queryKey:["courseRequests"]})
    })

    const date = parseISO(request?.sendTime)
    return (
        <div className={styles.card}>
            <p>{intlFormatDistance(
                new Date(date),
                Date.now(),
                {locale: 'ru', numeric: "auto"}
            )}</p>
            <p>{request.userEmail}</p>
            <p>{request.userName}</p>
            <p>{request.userPhone}</p>
            <p>{request.course?.title}</p>
            <p>{request.comment}</p>
            <div className={styles.buttonContainer}>
                {
                    !request.checked ? <CustomButton onClick={() => markAsCheckedMutation.mutate()} color={"white"} outline>
                        В архив
                    </CustomButton> : null
                }
            </div>
        </div>
    );
};

export default CourseRequestCard;