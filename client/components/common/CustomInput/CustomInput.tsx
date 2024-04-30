import React from 'react';
import styles from './CustomInput.module.sass';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


interface CustomInputProps {
    placeholder: string
    value: string | number
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    title?: string
    titleShow?: boolean
    error?: string | null
    name?: string
    id?: string
    onBlur?: () => void
}

const CustomInput = ({
    placeholder,
    value,
    onChange,
    title,
    titleShow= true,
    type= "text",
    error = null,
    name = '',
    id = '',
    onBlur = () => {}
} : CustomInputProps) => {
    const [checkBoxValue, setCheckBoxValue] = React.useState<boolean>(false);
    const onEyeButtonClick = () => {
        setCheckBoxValue(!checkBoxValue);
    }

    let inputClass = styles.input;

    if(error !== null){
        inputClass += ` ${styles.inputError}`
    }

    return (
        <div className={styles.inputSection}>
            {
                title !== '' &&
                <p className={styles.title}>
                    {title}
                    {type === "password"
                        && <FontAwesomeIcon
                            icon={!checkBoxValue ? faEye : faEyeSlash}
                            className={styles.eyeIcon}
                            onClick={onEyeButtonClick}
                        />}
                </p>
            }
            <input
                type={type === "password" ? checkBoxValue ? "text" : "password" : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                title={title}
                className={styles.input}
                name={name}
                id={id}
                onBlur={onBlur}
            />
            {error !== null && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default CustomInput;