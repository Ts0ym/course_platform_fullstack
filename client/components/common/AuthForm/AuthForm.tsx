import React, {FC, useState} from 'react';
import CustomInput from "@/components/common/CustomInput/CustomInput";
import styles from "./AuthForm.module.sass";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {useRouter} from "next/navigation";
import {AuthService} from "@/services/authService";
import {login} from "@/redux/slices/authSlice";
import {useAppDispatch} from "@/redux/hooks";

interface AuthFormProps {
    type: "login" | "register"
}

const AuthForm: FC<AuthFormProps> = ({type}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const [errorPassword, setErrorPassword] = useState<string | null>(null);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string | null>(null);
    const [errorEmail, setErrorEmail] = useState<string | null>(null);
    const [errorName, setErrorName] = useState<string | null>(null);
    const [errorSurname, setErrorSurname] = useState<string | null>(null);

    const router = useRouter()
    const appDispatch = useAppDispatch()

    const loginHandler =  async () => {
        if(validateLoginForm()) return;
        const response = await AuthService.login(email, password)
            .then(response => {
                const user = response.data.user;
                appDispatch(login(user))
                console.log(response)
                if(user.role === "admin") {
                    router.push("/admin")
                }else{
                    router.push('/')
                }

            })
            .catch(error => {
                if(error.response.status === 401) {
                    setErrorPassword("Неверные данные для авторизации")
                    setErrorEmail("Неверные данные для авторизации")
                }
            })
    }

    const registerHandler = async () => {
        if(validateRegisterForm()) return;
        await AuthService.register(email, password, name, surname)
            .then(response => {
                const user = response.data.user;
                appDispatch(login(user))
                console.log(response)
                if(user.role === "admin") {
                    router.push("/admin")
                }else{
                    router.push('/')
                }
            })
            .catch(error => {
                if(error.response.status === 400) {
                    setErrorEmail("Данный email уже зарегистрирован")
                }
            })
    }

    const validateRegisterForm = () => {
        let hasErrors = false;

        clearErrors();

        if (password !== confirmPassword) {
            setErrorPassword("Пароли не совпадают");
            setErrorConfirmPassword("Пароли не совпадают");
            hasErrors = true;
        }

        if (password === "") {
            setErrorPassword("Пароль не может быть пустым");
            hasErrors = true;
        }

        if (confirmPassword === "") {
            setErrorConfirmPassword("Подтвердите пароль");
            hasErrors = true;
        }

        if (email === "") {
            setErrorEmail("Электронная почта не может быть пустой");
            hasErrors = true;
        } else if (!validateEmail(email)) {
            setErrorEmail("Некорректный адрес электронной почты");
            hasErrors = true;
        }

        if (name === "") {
            setErrorName("Имя не может быть пустым");
            hasErrors = true;
        }

        if (surname === "") {
            setErrorSurname("Фамилия не может быть пустой");
            hasErrors = true;
        }

        return hasErrors;
    };

    const validateLoginForm = () => {
        let hasErrors = false;
        clearErrors();

        if (email === "") {
            setErrorEmail("Электронная почта не может быть пустой");
            hasErrors = true;
        } else if (!validateEmail(email)) {
            setErrorEmail("Некорректный адрес электронной почты");
            hasErrors = true;
        }

        if (password === "") {
            setErrorPassword("Пароль не может быть пустым");
            hasErrors = true;
        }

        return hasErrors;
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const clearErrors = () => {
        setErrorPassword(null)
        setErrorConfirmPassword(null)
        setErrorEmail(null)
        setErrorName(null)
        setErrorSurname(null)
    }

    return (
        <div className={styles.authForm}>
            <h1 className={styles.title}>{type === "login" ? "Войти" : "Зарегистрироваться"}</h1>
            <div className={styles.inputsSection}>
                <CustomInput
                    placeholder="Введите ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    title="Электронная почта"
                    titleShow={true}
                    type={"email"}
                    error={errorEmail}
                />
                <CustomInput
                    placeholder="Введите ваш пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    title="Пароль"
                    titleShow={true}
                    type={"password"}
                    error={errorPassword}
                />
                {type === "register" &&
                    <>
                        <CustomInput
                            placeholder="Подтвердите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            title="Подтвердите пароль" titleShow={true} type={"password"}
                            error={errorConfirmPassword}
                        />
                        <CustomInput
                            placeholder="Введите ваше имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            title="Имя"
                            titleShow={true}
                            error={errorName}
                        />
                        <CustomInput
                            placeholder="Введите вашу фамилию"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            title="Фамилия"
                            titleShow={true}
                            error={errorSurname}
                        />
                        <div className={styles.redirects}>
                            <p className={styles.loginRedirect}>Уже есть аккаунт? <span onClick={() => router.push("/auth/login")}>Войти</span></p>
                        </div>
                    </>
                }
                {type === "login" &&
                    <div className={styles.redirects}>
                        <p className={styles.loginRedirect}>Нет аккаунта? <span onClick={() => router.push("/auth/register")}>Зарегистрироваться</span></p>
                        <p onClick={() => router.push("/forgot")} className={styles.forgotRedirect}>Забыли пароль?</p>
                    </div>
                }
            </div>
            {
                type === 'login' ? <CustomButton onClick={() => loginHandler()} color={"blue"}>Войти</CustomButton> :
                    <CustomButton onClick={() => registerHandler()} color={"blue"}>Зарегистрироваться</CustomButton>
            }
        </div>
    );
};

export default AuthForm;