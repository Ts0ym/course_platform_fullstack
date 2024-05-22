import React from 'react';
import styles from './CustomSelect.module.sass';

interface ISelectValue {
    value: any;
    label: string;
}

interface CustomSelectProps {
    value: any;
    options: ISelectValue[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    title?: string;
    titleShow?: boolean;
    id?: string;
}

const CustomSelect = ({ value, options, onChange, title = "", titleShow = false, id=""}: CustomSelectProps) => {
    return (
        <div className={styles.selectContainer}>
            {title !== '' && <p className={styles.title}>{title}</p>}
            <select
                value={value}
                onChange={onChange}
                className={styles.customSelect}
                id={id}
            >
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