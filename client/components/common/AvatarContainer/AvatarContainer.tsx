import React from 'react';
import styles from "./AvatarContainer.module.sass"
import Image from "next/image";
import {API_URL} from "@/constants";

const AvatarContainer = ({ avatarPath, border = false} : { avatarPath: string, border?: boolean}) => {

    let buttonClass = styles.userImage;
    if(border) { (buttonClass += " " + styles.border); }

    return (
        <div className={buttonClass}>
            <Image
                src={API_URL + "image/" + avatarPath || "avatar_placeholder.jpg"}
                alt={"avatar"}
                layout="fill"
                objectFit="cover"
                quality={100}
            />
        </div>
    );
};

export default AvatarContainer;