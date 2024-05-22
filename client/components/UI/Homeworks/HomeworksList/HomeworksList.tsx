import React, {useEffect, useRef, useState} from 'react';
import { useQuery } from "@tanstack/react-query";
import { CoursesService } from "@/services/coursesService";
import styles from "./HomeworksList.module.sass";
import { Spinner } from "react-bootstrap";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowUpShortWide,
    faArrowUpWideShort,
    faChevronDown, faChevronUp,
    faFaceSadTear,
    faFilter
} from "@fortawesome/free-solid-svg-icons";
import HomeworkAdminCard from "@/components/UI/Homeworks/HomeworkAdminCard/HomeworkAdminCard";
import CustomRadioButtons from "@/components/common/CustomRadioButtons/CustomRadioButtons";
import CustomBottomModal from "@/components/common/CustomBottomModal/CustomBottomModal";
import HomeworksRateForm from "@/components/UI/Homeworks/HomeworksRateForm/HomeworksRateForm";
import EmptyPlaceholder from "@/components/common/EmptyPlaceholder/EmptyPlaceholder";

export interface HomeworkData {
    _id: string;
    lessonId: {
        _id: string,
        title: string,
        homeworkText: string,
        themeId: {
            _id: string,
            title: string,
            courseId: {
                _id: string,
                title: string,
            }
        }
    },
    userId: {
        _id: string,
        name: string,
        surname: string,
        email: string,
        avatar: string
    },
    content: string,
    grade: number,
    sendTime: string,
    assessment: string
    status: "submitted" | "returned" | "graded"
}

type sortOrder = 'newest' | 'oldest';

const HomeworksList: React.FC = () => {

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<sortOrder>('newest');
    const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedHomework, setSelectedHomework] = useState<HomeworkData>();
    const [homeworksType, setHomeworksType] = useState<"checked" | "unchecked">('unchecked');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, isLoading } = useQuery<HomeworkData[]>({
        queryKey: ['homeworks', homeworksType],
        queryFn: () => homeworksType === 'unchecked' ? CoursesService.getUncheckedHomeworks() : CoursesService.getCheckedHomeworks(),
    });

    const toggleHomeworkType = (type: "checked" | "unchecked") => {
        setHomeworksType(type);
        setShowDropdown(false);
    };

    const sortedData = React.useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            const dateA = new Date(a.sendTime).getTime();
            const dateB = new Date(b.sendTime).getTime();
            if (sortOrder === 'newest') {
                return dateB - dateA; // Сортировка по убыванию дат
            } else {
                return dateA - dateB; // Сортировка по возрастанию дат
            }
        });
    }, [data, sortOrder]);

    const sortingOptions = [
        { label: 'Сначала новые', value: 'newest' },
        { label: 'Сначала старые', value: 'oldest' }
    ]

    const handleOptionChange = (value: sortOrder) => {
        setShowSortOptions(false)
        setSortOrder(value);
    };

    const sortOptionsRef = useRef<HTMLDivElement>(null);  // Создаем ref для контейнера сортировки

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
        <>
            <CustomBottomModal onClose={() => {setShowModal(false)}} isOpen={showModal}>
                {selectedHomework && <HomeworksRateForm homework={selectedHomework} onRateSuccess={() => setShowModal(false)}/>}
            </CustomBottomModal>
            <div className={styles.homeworksList}>
                <h1 className={styles.title}>
                    Задания на проверку
                    {homeworksType === 'unchecked' && <span> (Текущие)</span>}
                    {homeworksType === 'checked' && <span> (Архив)</span>}
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
                                {homeworksType !== 'unchecked' && (
                                    <li onClick={() => toggleHomeworkType('unchecked')}>
                                        Задания на проверку
                                    </li>
                                )}
                                {homeworksType !== 'checked' && (
                                    <li onClick={() => toggleHomeworkType('checked')}>
                                        Архив заданий
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
                                <CustomRadioButtons options={sortingOptions} name={"sorting"} selectedValue={sortOrder} onChange={handleOptionChange}/>
                            </div>
                        )}
                    </div>
                    <button onClick={() => {}} className={styles.sortButton}>
                        <FontAwesomeIcon icon={faFilter} className={styles.icon}/>
                        Фильтр
                    </button>
                </div>
                <div className={styles.listHeader}>
                    <p>Когда сдано</p>
                    <p>Задание</p>
                    <p>Тема</p>
                    <p>Студент</p>
                    <p>Курс</p>
                </div>
                {
                    isLoading
                        ? <Spinner animation="border" variant="primary"/>
                        : sortedData && sortedData.length > 0
                            ? sortedData.map((homework: HomeworkData) =>
                                <HomeworkAdminCard
                                    data={homework}
                                    key={homework._id}
                                    onClick={() => {
                                        setSelectedHomework(homework);
                                        setShowModal(true)
                                    }}/>)
                            : <EmptyPlaceholder/>
                }
            </div>
        </>
    );
};

export default HomeworksList;
