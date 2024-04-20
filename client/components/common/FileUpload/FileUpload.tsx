import React, {ChangeEvent, useRef, useState} from 'react';
import styles from './FileUpload.module.sass'
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";

interface FileUploaderProps {
    onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
    onFileDelete: () => void
    fileValue: File | null
    title?: string
    titleShow?: boolean
    accept?: string
}

const FileUploader = ({ onFileSelect, onFileDelete, fileValue, title = "", titleShow = false, accept = "image/*"} : FileUploaderProps) => {

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={styles.fileUploader}>
            {titleShow && <p className={styles.title}>{title}</p>}
            <input
                type="file"
                accept={accept}
                name="image"
                onChange={onFileSelect}
                hidden
                ref={inputRef}
            />
            {fileValue &&
                <p className={styles.fileSelected}>
                    {fileValue.name}
                    <FontAwesomeIcon icon={faXmark} className={styles.deleteIcon} onClick={onFileDelete}/>
                </p>}
            {!fileValue && <CustomButton
                onClick={(e) => {
                    e.preventDefault();
                    inputRef.current?.click()
                }}
                color={"black"}>
                <FontAwesomeIcon icon={faPlus}/> Выбрать файл</CustomButton>}
        </div>
    )
};

export default FileUploader;