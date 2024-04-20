import React from 'react';
import Link from "next/link";
import styles from './BreadCrumbs.module.sass';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

const BreadCrumbs = ({breadcrumbs} :
                         {breadcrumbs: {title: string, path: string}[]}) => {
    return (
        <div className={styles.breadcrumbs}>
            {
                breadcrumbs.map(({title, path}, index) =>
                <Link href={path} key={index} className={styles.crumb}>
                    {title}
                    {(index !== breadcrumbs.length - 1) && <FontAwesomeIcon icon={faChevronRight} className={styles.arrow}/>}
                </Link>
                )
            }
        </div>
    );
};

export default BreadCrumbs;