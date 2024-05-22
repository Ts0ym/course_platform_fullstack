'use client'

import React, {useEffect, useRef, useState} from 'react';
import styles from './CustomBottomModal.module.sass';
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CustomBottomModal = ({ children, onClose, isOpen} : {children: React.ReactNode, onClose: () => void, isOpen: boolean}) => {

    const modalContentRef = useRef<HTMLDivElement>(null);
    const scrollToTop = () => {
        if (modalContentRef.current) {
            modalContentRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'  // Плавная прокрутка
            });
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Запрещаем скролл
        } else {
            document.body.style.overflow = 'unset'; // Возвращаем стандартное поведение скролла
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]); // Зависимость от состояния модального окна

    return (
        <div className={isOpen ? `${styles.modalOverlay} ${styles.open}` : styles.modalOverlay} onClick={onClose}>
            <button className={styles.closeButton} onClick={onClose}/>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} ref={modalContentRef}>
                {children}
                <FontAwesomeIcon icon={faChevronUp} className={styles.upButton} onClick={scrollToTop}/>
            </div>
        </div>
    );
};
export default CustomBottomModal;