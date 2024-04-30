import React from 'react';
import styles from "./EmptyPlaceholder.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFaceSadTear} from "@fortawesome/free-solid-svg-icons";

const EmptyPlaceholder = () => {
    return (
        <div className={styles.lessonsEmpty}>
            <FontAwesomeIcon icon={faFaceSadTear} className={styles.faIcon}/>
            <p>Тут пока пусто...</p>
        </div>
    );
};

export default EmptyPlaceholder;