'use client'

import {useAppSelector} from "@/redux/hooks";
import React from 'react';
import {redirect, useRouter} from "next/navigation";
import styles from "./AuthPage.module.sass"
import AuthForm from "@/components/common/AuthForm/AuthForm";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {Metadata} from "next";


interface PageProps {
    params: {
        type: string
    }
}

export default function Page({params: {type}}: PageProps){

    const user = useAppSelector(state => state.auth.user)
    const isAuthenticated = useAppSelector(state => state.auth?.isAuthenticated)
    const router = useRouter();

    if (!['login', 'register'].includes(type)) {
        redirect("/404")
    }

    return (
        <>
            <div className={styles.authPage}>
                <div className={styles.buttonContainer}>
                    <CustomButton
                        color={"white"}
                        onClick={() => {router.back()}}>
                        <FontAwesomeIcon icon={faChevronLeft} className={styles.icon}/>Назад</CustomButton>
                </div>
                <div className={styles.formContainer}>
                    <AuthForm type={type === "login"? "login" : "register"}/>
                </div>
            </div>
        </>
    );
};

