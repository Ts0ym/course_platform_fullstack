'use client'

import React from 'react';
import styles from "./BugReportIcon.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug} from "@fortawesome/free-solid-svg-icons";
import {usePathname, useRouter} from "next/navigation";
const BugReportIcon = () => {

    const router = useRouter();
    const pathname = usePathname();
    if (pathname === "/bugreport") return null;

    return (
        <div className={styles.container}>
            <div
                className={styles.iconContainer}
                onClick={() => router.push('/bugreport')}
            >
                <FontAwesomeIcon icon={faBug} className={styles.icon}/>
            </div>
            <div className={styles.titleContainer}>
                <p>Нашли баг? Сообщите нам и помогите стать лучше!</p>
            </div>
        </div>
    );
};

export default BugReportIcon;