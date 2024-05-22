import React from 'react';
import styles from './CustomTextBox.module.sass';

interface CustomTextBoxProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string;
    title?: string;
    titleShow?: boolean;
    id?: string
}
const CustomTextBox = ({ value, onChange, placeholder = '', title = '', titleShow = false, titleShow: boolean , id = ''} : CustomTextBoxProps) => {
    return (
        <div className={styles.CustomTextBoxContainer}>
            {title !== '' && <p className={styles.textBoxTitle}>{title}</p>}
            <textarea
                value={value}
                placeholder={placeholder}
                className={styles.CustomTextBox}
                onChange={onChange}
                id={id}
            />
        </div>
    );
};

export default CustomTextBox;