'use client'

import React, {useEffect, useState} from 'react';
import styles from './CustomModal.module.sass';

const CustomModal = ({ children, onClose, isOpen} : {children: React.ReactNode, onClose: () => void, isOpen: boolean}) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Запрещаем скролл
        } else {
            document.body.style.overflow = 'unset'; // Возвращаем стандартное поведение скролла
        }

        // Очищаем изменения при размонтировании компонента
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]); // Зависимость от состояния модального окна

    return (
        <div className={isOpen ? `${styles.modalOverlay} ${styles.open}` : styles.modalOverlay} onClick={onClose}>
            <button className={styles.closeButton} onClick={onClose}/>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default CustomModal;