import React, {ChangeEvent, FC, MouseEventHandler, PropsWithChildren} from 'react';
import styles from "./CustomButton.module.sass"

interface CustomButtonProps{
    onClick: MouseEventHandler<HTMLButtonElement>
    color: "red" | "blue" | "white" | "black"
    type?: "button" | "submit" | "reset"
    outline?: boolean
    shadow?: boolean
}

const CustomButton = ({onClick, color, children, type = "button", outline = false, shadow = false} : PropsWithChildren<CustomButtonProps>) => {

    let buttonClass = styles.customButton;

    switch(color){
        case "red":
            buttonClass += ` ${styles.redButton}`;
            break;
        case "blue":
            buttonClass += ` ${styles.blueButton}`;
            break;
        case "white":
            buttonClass += ` ${styles.whiteButton}`;
            break;
        case "black":
            buttonClass += ` ${styles.blackButton}`;
    }

    if(outline){ buttonClass += ` ${styles.outlineButton}`; }
    if(shadow){ buttonClass += ` ${styles.shadowButton}`; }

    return (
        <button
            onClick={onClick}
            className={buttonClass}
            type={type}>
            {children}
        </button>
    );
}

export default CustomButton;