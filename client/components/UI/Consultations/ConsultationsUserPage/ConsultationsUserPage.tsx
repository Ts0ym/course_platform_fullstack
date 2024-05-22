'use client'

import React from 'react';
import CustomCenterModal from "@/components/common/CustomCenterModal/CustomCenterModal";
import CreateConsultationRequestForm
    from "@/components/UI/Consultations/CreateConsultationRequestForm/CreateConsultationRequestForm";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from './ConsultationsUserPage.module.sass';
import {useQuery} from "@tanstack/react-query";
import {IConsultationRequest} from "@/types";
import {CoursesService} from "@/services/coursesService";
import {useAppSelector} from "@/redux/hooks";
import ConsultationUserCard from "@/components/UI/Consultations/ConsultationUserCard/ConsultationUserCard";
import ConsultationsUserList from "@/components/UI/Consultations/ConsultationsUserList/ConsultationsUserList";

const ConsultationsUserPage = () => {
    const [showCreateForm, setShowCreateForm] = React.useState(false);
    const user = useAppSelector(state => state.auth.user)
    const {data: consultations} = useQuery<IConsultationRequest[]>({
        queryFn: async () => CoursesService.getAllConsultationRequestsForUser(user?._id || ''),
        queryKey: ['consultationsForUser']
    });
    return (
        <>
            <CustomCenterModal
                onClose={() => setShowCreateForm(false)}
                isOpen={showCreateForm}
            >
                <CreateConsultationRequestForm/>
            </CustomCenterModal>
            <div className={styles.page}>
                <div className={styles.createButtonContainer}>
                    <CustomButton
                        onClick={() => setShowCreateForm(true)}
                        color={'black'}>
                        <FontAwesomeIcon icon={faPlus}/> Создать заявку на консультацию
                    </CustomButton>
                </div>
                <div className={styles.consultationsContainer}>
                    <h1>Ваши записи</h1>
                    <ConsultationsUserList requests={consultations || []}/>
                </div>
            </div>
        </>
    );
};

export default ConsultationsUserPage;