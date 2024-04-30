import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import styles from "./CustomRatingStars.module.sass";

const CustomRatingStars = ({ totalStars = 5, rating, onRatingChange, title} :
                               {
                                   totalStars: number,
                                   rating: number,
                                   onRatingChange: (index: number) => void,
                                   title?: string
                               }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    return (
        <div className={styles.ratingContainer}>
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.starsContainer}>
                {Array.from({ length: totalStars }, (_, index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        className={`${styles.star} ${(hoverIndex !== null ? index <= hoverIndex : index < rating) ? styles.filled : ''}`}
                        onClick={() => onRatingChange(index + 1)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </div>
        </div>
    );
};

export default CustomRatingStars;
