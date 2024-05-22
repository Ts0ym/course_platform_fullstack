import React, {useEffect, useRef, useState} from 'react';
import styles from './CoursesRequestList.module.sass';
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
import {sortOrder} from "@/components/UI/Users/UsersList/UsersList";
import {Spinner} from "react-bootstrap";
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {ICourseRequest} from "@/types";
import CourseRequestCard from "@/components/UI/Courses/CourseRequestCard/CourseRequestCard";

const CoursesRequestList = () => {

    const [searchQuery, setSearchQuery] = React.useState('')
    const [sortOrder, setSortOrder] = useState<sortOrder>('newest');
    const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const sortOptionsRef = useRef<HTMLDivElement>(null);
    const [selectedRequestsType, setSelectedRequestsType] = useState<"checked" | "unchecked">('unchecked');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {data: courseRequests, isLoading } = useQuery({
        queryFn: async () => selectedRequestsType === "unchecked"
            ? CoursesService.getUncheckedCourseRequests()
            : CoursesService.getCheckedCourseRequests(),
        queryKey: ["courseRequests", selectedRequestsType]
    })

    const toggleHomeworkType = (type: "checked" | "unchecked") => {
        setSelectedRequestsType(type);
        setShowDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Проверяем, что sortOptionsRef.current существует и клик произведен вне элемента
            if (sortOptionsRef.current && !sortOptionsRef.current.contains(event.target as Node)) {
                setShowSortOptions(false);
            }
            // Проверяем, что dropdownRef.current существует и клик произведен вне элемента
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);  // Закрываем выпадающее меню
            }
        };

        // Проверяем, нужно ли добавлять обработчик
        if (showSortOptions || showDropdown) {
            // Добавляем обработчик клика для всего документа
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Функция очистки, удаляющая обработчик
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSortOptions, showDropdown]);

    return (
        <div className={styles.list}>
            <h1 className={styles.title}>
                Заявки на обратную связь
                {selectedRequestsType === 'unchecked' && <span> (Текущие)</span>}
                {selectedRequestsType === 'checked' && <span> (Архив)</span>}
                <button onClick={() => setShowDropdown(!showDropdown)} className={styles.dropdownButton}>
                    {
                        !showDropdown
                            ? <FontAwesomeIcon icon={faChevronDown}/>
                            : <FontAwesomeIcon icon={faChevronUp}/>
                    }
                </button>
                {showDropdown && (
                    <div className={styles.dropdownMenu} ref={dropdownRef}>
                        <ul>
                            {selectedRequestsType !== 'unchecked' && (
                                <li onClick={() => toggleHomeworkType('unchecked')}>
                                    Заявки на курсы
                                </li>
                            )}
                            {selectedRequestsType !== 'checked' && (
                                <li onClick={() => toggleHomeworkType('checked')}>
                                    Архив заявок
                                </li>
                            )}
                        </ul>
                    </div>
                )}
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
                            <CustomRadioButtons options={[]} name={"sorting"} selectedValue={sortOrder} onChange={() => {}}/>
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
                    <p>Дата</p>
                    <p>Email</p>
                    <p>Имя</p>
                    <p>Телефон</p>
                    <p>Название курса</p>
                    <p>Комментарий</p>
                    <p></p>
                </div>
                {
                    isLoading
                        ? <Spinner animation="border" variant="primary"/>
                        : courseRequests?.map((request: ICourseRequest) => <CourseRequestCard request={request}/>)
                }
            </div>
        </div>
    );
};

export default CoursesRequestList;