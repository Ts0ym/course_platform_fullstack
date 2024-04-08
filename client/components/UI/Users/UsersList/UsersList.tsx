import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {UsersService} from "@/services/usersService";
import {IUser} from "@/types";
import styles from './UsersList.module.sass';
import {Spinner} from "react-bootstrap";
import UsersCard from "@/components/UI/Users/UsersCard/UsersCard";
import SearchInput from "@/components/common/SearchInput/SearchInput";

const UsersList = () => {

    const {data, isLoading, isError} = useQuery({
        queryFn: () => UsersService.getAllUsers(),
        queryKey: ['users'],
    })
    const [searchQuery, setSearchQuery] = React.useState('')

    const getFilteredUsers = (users: IUser[] | undefined, searchQuery: string) => {
        if (!searchQuery) {return users}
        if (!users) {return []}
        const query = searchQuery.toLowerCase();
        return users.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(query);
            const surnameMatch = user.surname.toLowerCase().includes(query);
            const emailMatch = user.email.toLowerCase().includes(query);
            const roleMatch = user.role.toLowerCase().includes(query);
            return nameMatch || surnameMatch || emailMatch || roleMatch;
        })
    }

    const filteredUsers = getFilteredUsers(data, searchQuery)

    return (
        <div className={styles.usersList}>
            <div className={styles.controlsContainer}>
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onDeleteClick={() => setSearchQuery('')}
                />
            </div>
            <div className={styles.tableContainer}>
                <div className={styles.infoHeader}>
                    <p>Email</p>
                    <p>Имя</p>
                    <p>Фамилия</p>
                    <p>Роль</p>
                </div>
                {
                    isLoading
                        ? <Spinner animation="border" variant="primary"/>
                        : filteredUsers?.map(user => <UsersCard user={user} key={user._id}/>)
                }
            </div>
        </div>
    );
};

export default UsersList;