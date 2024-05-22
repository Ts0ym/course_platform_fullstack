'use client'
import React from 'react';
import styles from "./BackButton.module.sass";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useRouter} from "next/navigation";

const BackButton = () => {
    const router = useRouter();
    return (
            <div className={styles.button}>
                <CustomButton
                    onClick={() => router.back()}
                    color={"white"}
                    outline
                >Назад</CustomButton>
            </div>
    );
};

export default BackButton;