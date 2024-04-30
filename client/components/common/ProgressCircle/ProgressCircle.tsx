import React from 'react';
import styles from './ProgressCircle.module.sass';

const ProgressCircle = ({ percent = 0, isPercentVisible = false } : {percent: number, isPercentVisible?: boolean}) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference || 0;

    return (
        <svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" style={{width: '100%', height: '100%'}}>
            <circle
                cx="60"
                cy="60"
                r={radius}
                className={styles.circleBackground} // Использование класса для фонового круга
            />
            <circle
                cx="60"
                cy="60"
                r={radius}
                className={styles.circleProgress} // Использование класса для круга прогресса
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
            />
            {
                isPercentVisible &&
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" className={styles.percentText}>
                    {percent}%
                </text>
            }
        </svg>
    );
};

export default ProgressCircle;