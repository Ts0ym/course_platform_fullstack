import React from 'react';
import styles from "./AvatarContainer.module.sass"
import Image from "next/image";
import {API_URL} from "@/constants";

const AvatarContainer = ({ avatarPath, border = false} : { avatarPath: string, border?: boolean}) => {

    let containerClass = styles.userImage;
    if(border) { (containerClass += " " + styles.border); }

    return (
        <div className={containerClass}>
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