import React from 'react';
import styles from './CustomCheckbox.module.sass';

const CustomCheckbox = ({ value, onChange, label = ''} :
                            {
                                value: boolean,
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
                                label?: string
                            }) => {

    const checkBoxRef = React.useRef(null);

    return (
        <div className={styles.container}>
            <input
                type="checkbox"
                checked={value}
                onChange={onChange}
                className={styles.checkbox}
                id="customCheckbox"
            />
            <label htmlFor="customCheckbox" className={styles.checkboxCustom}></label>
            {label !== '' && <p className={styles.label}>{label}</p>}
        </div>
    );
};

export default CustomCheckbox;