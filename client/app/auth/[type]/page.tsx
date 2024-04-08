'use client'
import {useAppSelector} from "@/redux/hooks";
import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";
import styles from "./AuthPage.module.sass"
import AuthForm from "@/components/common/AuthForm/AuthForm";

interface PageProps {
    params: {
        type: string
    }
}

const Page = ({params: {type}}: PageProps) => {

    const user = useAppSelector(state => state.auth.user)
    const isAuthenticated = useAppSelector(state => state.auth?.isAuthenticated)
    const router = useRouter();

    useEffect(() => {
        if(type !== "login" && type !== "register"){
            router.push("/404")
        }
    }, []);

    return (
        <div className={styles.authPage}>
            <AuthForm type={type === "login"? "login" : "register"}/>
        </div>
    );
};

export default Page;