import React from 'react';
import styles from './RateLessonForm.module.sass';
import CustomRatingStars from "@/components/common/CustomRatingStars/CustomRatingStars";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import CustomButton from "@/components/common/CustomButton/CustomButton";

const RateLessonForm = () => {
    return (
        <div className={styles.rateLessonForm}>
            <h1>Как вам урок?</h1>
            <CustomRatingStars
                totalStars={5} rating={0}
                onRatingChange={() => {}}/>
            <CustomTextBox
                value={''}
                onChange={() => {}}
                placeholder={'Опишите ваше пожелания к уроку'}
                title={"Есть замечания по уроку?"}/>
            <div className={styles.btnContainer}>
                <CustomButton onClick={() => {}} color={"black"}>Сохранить отзыв</CustomButton>
            </div>
        </div>
    );
};

export default RateLessonForm;