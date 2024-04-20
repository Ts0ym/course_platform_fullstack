'use client'

import React, {useState} from 'react';
import styles from './NavBar.module.sass';
import {NAVBAR_ROUTES} from "@/constants";
import Link from "next/link";
import Image from "next/image";
import {useAppSelector} from "@/redux/hooks";

export interface NavBarRoute {
    title: string,
    path: string
}

const NavBar = () => {

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const user = useAppSelector(state => state.auth.user)

    return (
        <div className={styles.navbar}>

                <div className={styles.navBarImage}>
                    <Image src={"/images/headerlogo.png"} alt={"logo"} width={600} height={600} layout="responsive"/>
                </div>
                <div className={styles.navBarControls}>
                    <div className={styles.navBarLinks}>
                        {
                            NAVBAR_ROUTES.map((link, index) => <Link
                                key={index}
                                href={link.path}
                                className={styles.navBarLink}>{link.title}</Link>)
                        }
                        {
                            user && user.role === 'admin' &&
                            <Link href={'/admin'} className={styles.navBarLink}>Администрирование</Link>
                        }
                    </div>
                    {
                        user &&
                        <div className={styles.userInfo}
                             onMouseEnter={() => setIsDropdownVisible(true)}
                             onMouseLeave={() => setIsDropdownVisible(false)}>
                            <div className={styles.userCredentials}>
                                <h1>{`${user.name} ${user.surname}`}</h1>
                                <p>{user.email}</p>
                            </div>
                            <div className={styles.userImage}></div>
                            {isDropdownVisible && (
                                <div className={styles.dropdownMenu}>
                                    <Link href="/mycourses" className={styles.dropdownItem}>Мои курсы</Link>
                                    <Link href="/profile" className={styles.dropdownItem}>Профиль</Link>
                                    <Link href="/settings" className={styles.dropdownItem}>Настройки</Link>
                                </div>
                            )}
                        </div>
                    }
                </div>
        </div>
    );
};

export default NavBar;