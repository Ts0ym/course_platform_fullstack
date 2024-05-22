import React, {useState} from 'react';
import {Modal} from "react-bootstrap";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import CreateAchievementForm from "@/components/UI/Achievements/AchievementsCreateForm/AchievementsCreateForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import styles from './AchievementsAdminPage.module.sass';
import {useQuery} from "@tanstack/react-query";
import {AchievementService} from "@/services/achievementsService";
import {IAchievement} from "@/types";
import AchievementsAdminCard from "@/components/UI/Achievements/AchievementsAdminCard/AchievementsAdminCard";

const AchievementsAdminPage = () => {
    const [showModal, setShowModal] = useState(false);
    const {data: allAchievements} = useQuery({
        queryFn: async () => AchievementService.getAllAchievements(),
        queryKey: ["allAchievements"]
    })

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создание курса</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateAchievementForm />
                </Modal.Body>
                <Modal.Footer>
                    <CustomButton onClick={() => setShowModal(false)} color="white" outline>Отмена</CustomButton>
                </Modal.Footer>
            </Modal>
            <div className={styles.pageContainer}>
                <div className={styles.buttonContainer}>
                    <CustomButton onClick={() => setShowModal(true)} color="black">
                        <FontAwesomeIcon icon={faPlus} /> Создать достижение
                    </CustomButton>
                </div>
                <div className={styles.achievementsList}>
                    {
                        allAchievements && allAchievements.map((e: IAchievement)  =>
                        <AchievementsAdminCard achievement={e} key={e._id} /> )
                    }
                </div>
            </div>
        </>
    );
};

export default AchievementsAdminPage;