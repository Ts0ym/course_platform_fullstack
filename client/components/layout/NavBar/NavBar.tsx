'use client'

import React, {useEffect, useState} from 'react';
import styles from './NavBar.module.sass';
import {API_URL, NAVBAR_ROUTES} from "@/constants";
import Link from "next/link";
import Image from "next/image";
import {useAppSelector} from "@/redux/hooks";
import {AuthService} from "@/services/authService";
import {router} from "next/client";
import {usePathname, useRouter} from "next/navigation";
import useLogout from "@/hooks/useLogout";
import AvatarContainer from "@/components/common/AvatarContainer/AvatarContainer";
import CustomButton from "@/components/common/CustomButton/CustomButton";

export interface NavBarRoute {
    title: string,
    path: string
}

const NavBar = () => {

    const user = useAppSelector(state => state.auth.user);
    const logout = useLogout();
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname()
    const scrollingPathExceptions: string[] = ['/admin', '/lesson']

    useEffect(() => {
        if(!scrollingPathExceptions.some(elem => pathname.includes(elem))){
            const handleScroll = () => {
                const offset = window.scrollY;
                setIsScrolled(offset > 10); // активируется когда пользователь проскроллил больше 50px
            };

            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }else{
            setIsScrolled(false)
        }
    }, [pathname]);

    return (
            <div className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={styles.navBarImage}>
                    <Image src={"/images/headerlogo.png"} alt={"logo"} width={600} height={600} layout="responsive" priority/>
                    <p className={styles.betaShield}>Beta</p>
                </div>
                <div className={styles.navBarControls}>
                    <div className={styles.navBarLinks}>
                        {
                            !pathname.includes('auth') &&
                            NAVBAR_ROUTES.map((link, index) => <Link
                                key={index}
                                href={link.path}
                                className={styles.navBarLink}>{link.title}</Link>)
                        }
                        {
                            user && user.role === 'admin' &&
                            <Link href={'/admin'} className={styles.navBarLink}>Администрирование</Link>
                        }
                        {
                            !user && !pathname.includes('auth') &&
                            <div className={styles.navBarLogin}>
                                <CustomButton onClick={() => router.push('auth/register')} color={'black'}>Регистрация</CustomButton>
                            </div>
                        }
                    </div>
                    {
                        user &&
                        <div className={styles.userInfo}>

                            <div className={styles.userCredentials}>
                                <h1>{`${user.name} ${user.surname}`}</h1>
                                <p className={styles.userEmail}>{user.email}</p>
                            </div>

                            <div className={styles.userImage}>
                                <AvatarContainer avatarPath={user.avatar} border/>
                            </div>

                            <div className={styles.dropdownMenu}>
                                <Link href="/mycourses" className={styles.dropdownItem}>Мои курсы</Link>
                                <Link href="/profile" className={styles.dropdownItem}>Профиль</Link>
                                <p className={styles.exitItem} onClick={() => logout()}>Выйти из профиля</p>
                            </div>

                        </div>
                    }
                </div>
        </div>
    );
};

export default NavBar;