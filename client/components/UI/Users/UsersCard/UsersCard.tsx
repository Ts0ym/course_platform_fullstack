import React, {FC} from 'react';
import {IUser} from "@/types";
import styles from "./UsersCard.module.sass";

interface UsersCardProps {
    user: IUser;
}

const UsersCard: FC<UsersCardProps> = ({user}) => {
    return (
        <div className={styles.userCard}>
            <p>{user.email}</p>
            <p>{user.name}</p>
            <p>{user.surname}</p>
            <p>{user.role}</p>
        </div>
    );
};

export default UsersCard;