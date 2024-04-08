import React from 'react';
import styles from './CustomSelect.module.sass';

interface ISelectValue {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    options: ISelectValue[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    title?: string;
    titleShow: boolean;
}

const CustomSelect = ({ value, options, onChange, title = "", titleShow = false}: CustomSelectProps) => {
    return (
        <div className={styles.selectContainer}>
            {titleShow && <p className={styles.title}>{title}</p>}
            <select value={value} onChange={onChange} className={styles.customSelect}>
                {options.map((option) =>
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                )}
            </select>
        </div>
    );
};

export default CustomSelect;