import React, {ChangeEvent, FC} from 'react';
import styles from './SearchInput.module.sass';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons"

interface SearchInputProps {
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onDeleteClick?: () => void;
}
const SearchInput: FC<SearchInputProps> = ({ value, onChange, onDeleteClick }) => {
    return (
        <div className={styles.inputContainer}>
            <input type="text" placeholder="Поиск..." value={value} onChange={onChange}/>
            <div className={styles.iconsContainer}>
                {value !== "" && <>
                    <FontAwesomeIcon icon={faXmark} className={styles.deleteIcon} onClick={onDeleteClick}/>
                    <div className={styles.separator}></div>
                </>}
                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon}/>
            </div>
        </div>
    );
};

export default SearchInput;