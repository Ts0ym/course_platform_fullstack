'use client'

import {FormErrors, FormValues, useForm} from "@/hooks/useForm";
import {AuthService} from "@/services/authService";
import {login} from "@/redux/slices/authSlice";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/redux/hooks";
import styles from "@/components/common/AuthForm/AuthForm.module.sass";
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import React from "react";

interface AuthFormProps {
    type: "login" | "register"
}

const AuthForm = ({ type } : AuthFormProps) => {

    const router = useRouter()
    const appDispatch = useAppDispatch()
    const initialValues: FormValues = {
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        surname: ""
    }

    const validateAuthForm = (values: FormValues) => {
        const errors: FormErrors = {};

        if (!values.email) {
            errors.email = "Email не может быть пустым";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = "Некорректный email";
        }

        if (!values.password) {
            errors.password = "Пароль не может быть пустым";
        } else if (values.password.length < 6) {
            errors.password = "Длина пароля должна быть не менее 6 символов";
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = "Подтвердите пароль";
        }

        if(values.password!== values.confirmPassword) {
            errors.confirmPassword = "Пароли не совпадают";
        }

        if(!values.name) {
            errors.name = "Имя не может быть пустым";
        }

        if(!values.surname) {
            errors.surname = "Фамилия не может быть пустой";
        }

        return errors;
    }

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        setErrors,
        handleBlur
    } = useForm(initialValues, validateAuthForm);

    const loginHandler = () => handleAuth(async () => await AuthService.login(values.email, values.password), "/")
    const registerHandler = () => handleAuth(async () => await AuthService.register(
        values.email,
        values.password,
        values.name,
        values.surname
    ), "/")

    const handleAuth = async (authFn: () => Promise<any>, redirectPath: string) => {
        await authFn()
            .then(response => {
                const user = response.data.user;
                appDispatch(login(user))
                console.log(response)
                router.push(user.role === "admin"? "/admin" : redirectPath)})
            .catch(error => {
                if(error.response.status === 400) {
                    setErrors({...errors, email : "Данный email уже зарегистрирован"})
                } else if(error.response.status === 401) {
                    setErrors({
                        ...errors,
                        password : "Неверные данные для авторизации",
                        email : "Неверные данные для авторизации"})
                }
            })
    }

    return (
        <div className={styles.authForm}>
            <h1 className={styles.title}>{type === "login" ? "Войти" : "Зарегистрироваться"}</h1>
            <div className={styles.inputsSection}>
                <CustomInput
                    placeholder="Введите ваш email"
                    value={values.email}
                    onChange={handleChange}
                    title="Электронная почта"
                    titleShow={true}
                    type={"email"}
                    error={errors.email}
                    id={"email"}
                />
                <CustomInput
                    placeholder="Введите ваш пароль"
                    value={values.password}
                    onChange={handleChange}
                    title="Пароль"
                    titleShow={true}
                    type={"password"}
                    error={errors.password}
                    id={"password"}
                />
                {type === "register" &&
                    <>
                        <CustomInput
                            placeholder="Подтвердите пароль"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            title="Подтвердите пароль" titleShow={true} type={"password"}
                            error={errors.confirmPassword}
                            id={"confirmPassword"}
                        />
                        <CustomInput
                            placeholder="Введите ваше имя"
                            value={values.name}
                            onChange={handleChange}
                            title="Имя"
                            titleShow={true}
                            error={errors.name}
                        />
                        <CustomInput
                            placeholder="Введите вашу фамилию"
                            value={values.surname}
                            onChange={handleChange}
                            title="Фамилия"
                            titleShow={true}
                            error={errors.surname}
                        />
                        <div className={styles.redirects}>
                            <p className={styles.loginRedirect}>Уже есть аккаунт? <span onClick={() => router.push("/auth/login")}>Войти</span></p>
                        </div>
                    </>
                }
                {type === "login" &&
                    <div className={styles.redirects}>
                        <p
                            className={styles.loginRedirect}>
                            Нет аккаунта?
                            <span
                                onClick={() => router.push("/auth/register")}>Зарегистрироваться
                            </span>
                        </p>
                        <p onClick={() => router.push("/forgot")} className={styles.forgotRedirect}>Забыли пароль?</p>
                    </div>
                }
            </div>
            <CustomButton
                onClick={(e) => {
                    handleSubmit(e);
                    type === 'login' ? loginHandler() : registerHandler()
                }}
                color={"black"}>
                {type === "login" ? "Войти" : "Зарегистрироваться"}
            </CustomButton>
        </div>
    );
}

export default AuthForm;