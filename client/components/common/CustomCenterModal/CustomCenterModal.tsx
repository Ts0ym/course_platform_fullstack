'use client'

import React, {useEffect} from 'react';
import styles from "./CustomCenterModal.module.sass";

const CustomCenterModal = ({ children, onClose, isOpen} : {children: React.ReactNode, onClose: () => void, isOpen: boolean}) => {

    // useEffect(() => {
    //     if (isOpen) {
    //         document.body.style.overflow = 'hidden'; // Запрещаем скролл
    //     } else {
    //         document.body.style.overflow = 'unset'; // Возвращаем стандартное поведение скролла
    //     }
    //
    //     return () => {
    //         document.body.style.overflow = 'unset';
    //     };
    // }, [isOpen]); // Зависимость от состояния модального окна

    return (
        <div className={isOpen ? `${styles.modalOverlay} ${styles.open}` : styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}/>
                {children}
            </div>
        </div>
    );
};

export default CustomCenterModal;