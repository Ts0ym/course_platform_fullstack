import React, {useRef, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {UsersService} from "@/services/usersService";
import {IUser} from "@/types";
import styles from './UsersList.module.sass';
import {Spinner} from "react-bootstrap";
import UsersCard from "@/components/UI/Users/UsersCard/UsersCard";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowUpShortWide,
    faArrowUpWideShort,
    faChevronDown,
    faChevronUp,
    faFilter
} from "@fortawesome/free-solid-svg-icons";
import CustomRadioButtons from "@/components/common/CustomRadioButtons/CustomRadioButtons";

export type sortOrder = 'newest' | 'oldest';

const UsersList = () => {

    const {data, isLoading, isError} = useQuery({
        queryFn: () => UsersService.getAllUsers(),
        queryKey: ['users'],
    })
    const [searchQuery, setSearchQuery] = React.useState('')
    const [sortOrder, setSortOrder] = useState<sortOrder>('newest');
    const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
    const sortOptionsRef = useRef<HTMLDivElement>(null);

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

    const sortingOptions = [
        { label: 'Сначала новые', value: 'newest' },
        { label: 'Сначала старые', value: 'oldest' }
    ]

    const handleOptionChange = (value: sortOrder) => {
        setShowSortOptions(false)
        setSortOrder(value);
    };

    const filteredUsers = getFilteredUsers(data, searchQuery)

    return (
        <div className={styles.usersList}>
            <h1 className={styles.title}>
                Управление пользователями
            </h1>
            <div className={styles.controlsContainer}>
                <div className={styles.searchBarContainer}>
                    <SearchInput
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        onDeleteClick={() => setSearchQuery('')}
                    />
                </div>
                <div className={styles.sortControls}>
                    <button onClick={() => setShowSortOptions(!showSortOptions)} className={styles.sortButton}>
                        {
                            sortOrder === "newest"
                                ? <FontAwesomeIcon icon={faArrowUpWideShort} className={styles.icon}/>
                                : <FontAwesomeIcon icon={faArrowUpShortWide} className={styles.icon}/>
                        }
                        Сортировка
                    </button>
                    {showSortOptions && (
                        <div className={styles.sortOptionsContainer} ref={sortOptionsRef}>
                            <CustomRadioButtons options={sortingOptions} name={"sorting"} selectedValue={sortOrder} onChange={handleOptionChange}/>
                        </div>
                    )}
                </div>
                <button onClick={() => {}} className={styles.sortButton}>
                    <FontAwesomeIcon icon={faFilter} className={styles.icon}/>
                    Фильтр
                </button>
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