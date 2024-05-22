import React from 'react';
import styles from './AchievementsAdminCard.module.sass';
import Image from "next/image";
import {API_URL} from "@/constants";
import {IAchievement} from "@/types";
import CustomButton from "@/components/common/CustomButton/CustomButton";

const AchievementsAdminCard = ({achievement} : { achievement: IAchievement }) => {
    return (
        <div className={styles.card}>
            <div className={styles.courseImage}>
                <Image src={API_URL + "image/" + achievement.icon} alt={"image"} width={200} height={200}/>
            </div>
            <h1>{achievement.title}</h1>
            <h2>{achievement.description}</h2>
            <h2>{achievement.condition}</h2>
            <div className={styles.buttonContainer}>
                <CustomButton onClick={() => {}} color={'red'} outline>Удалить</CustomButton>
            </div>
        </div>
    );
};

export default AchievementsAdminCard;