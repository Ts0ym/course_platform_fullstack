import React from 'react';
import styles from "./HomeworkContent.module.sass";
import {format, parseISO} from "date-fns";
import {ru} from "date-fns/locale";
import {IUser} from "@/types";
import AvatarContainer from "@/components/common/AvatarContainer/AvatarContainer";

const HomeworkContent = ({content, sendTime, assessment, user} : {content:string, sendTime:string, assessment?:string, user: any}) => {
    return (
        <div className={styles.contentContainer}>
            <p>{content}</p>
            <div className={styles.dateContainer}>
                <div className={styles.userInfo}>
                    <div className={styles.avatarContainer}>
                        <AvatarContainer avatarPath={user.avatar}/>
                    </div>
                    <p>{user.email}</p>
                </div>
                <p>{format(parseISO(sendTime), "d MMMM 'в' HH:mm", { locale: ru })}</p>
            </div>
        </div>
    );
};

export default HomeworkContent;