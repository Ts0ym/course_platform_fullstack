import React from 'react';
import styles from './InfoContainer.module.sass';

const InfoContainer = ({title, content} : {title: string, content: string}) => {
    return (
        <div className={styles.container}>
            <p className={styles.title}>{title}</p>
            <div className={styles.content}>
                {content}
            </div>
        </div>
    );
};

export default InfoContainer;