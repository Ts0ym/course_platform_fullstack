import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import styles from "./ConsultationsRequestsList.module.sass";
import ConsultationsRequestsCard
    from "@/components/UI/Consultations/ConsultationsRequestsCard/ConsultationsRequestsCard";
import {IConsultationRequest} from "@/types";
import CustomCenterModal from "@/components/common/CustomCenterModal/CustomCenterModal";
import ConsultationsAdminForm from "@/components/UI/Consultations/ConsultationsAdminForm/ConsultationsAdminForm";

const ConsultationsRequestsList = () => {

    // const [isModalOpen, setIsModalOpen] = React.useState(false);
    // const [currentRequestSelected, setCurrentRequestSelected] = React.useState<IConsultationRequest | null>(null);
    // const {data, isLoading, isError } = useQuery({
    //     queryFn: async () =>
    //         CoursesService.getPendingConsultationRequests()
    //     ,
    //     queryKey: ['pendingConsultationRequests']
    // })
    //
    // const onCardClick = (request: IConsultationRequest) => {
    //     setIsModalOpen(true)
    //     setCurrentRequestSelected(request)
    // }
    // if (isError) return null

    return (
        <>
            {/*<CustomCenterModal*/}
            {/*    onClose={() => setIsModalOpen(false)}*/}
            {/*    isOpen={isModalOpen}>*/}
            {/*    <ConsultationsAdminForm request={currentRequestSelected} onSuccess={() => setIsModalOpen(false)}/>*/}
            {/*</CustomCenterModal>*/}
            {/*<div className={styles.list}>*/}
            {/*    <h1 className={styles.title}>Заявки на консультации</h1>*/}
            {/*    <div className={styles.listHeader}>*/}
            {/*        <p>Email пользователя</p>*/}
            {/*        <p>Имя пользователя</p>*/}
            {/*        <p>Дата заявки</p>*/}
            {/*        <p>Планируемая дата начала</p>*/}
            {/*        <p>Планируемая дата завершения</p>*/}
            {/*    </div>*/}
            {/*    {*/}
            {/*        data?.map((request: IConsultationRequest) =>*/}
            {/*            <ConsultationsRequestsCard*/}
            {/*                request={request}*/}
            {/*                onClick={() => onCardClick(request)}*/}
            {/*            />)*/}
            {/*    }*/}
            {/*</div>*/}
        </>
    );
};

export default ConsultationsRequestsList;