import React, {FC} from 'react';
import {IUser} from "@/types";
import styles from "./UsersCard.module.sass";
import {useRouter} from "next/navigation";

interface UsersCardProps {
    user: IUser;
}

const UsersCard: FC<UsersCardProps> = ({user}) => {
    const router = useRouter();
    return (
        <div className={styles.userCard} onClick={() => router.push(`admin/user/${user._id}`)}>
            <p>{user.email}</p>
            <p>{user.name}</p>
            <p>{user.surname}</p>
            <p>{user.role}</p>
        </div>
    );
};

export default UsersCard;