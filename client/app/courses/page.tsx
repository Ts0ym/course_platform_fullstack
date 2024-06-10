'use client'
import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import styles from './CoursesPage.module.sass';
import { CoursesService } from "@/services/coursesService";
import CoursesDisplayCard from "@/components/UI/Courses/CoursesDisplayCard/CoursesDisplayCard";
import { Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import CustomCenterModal from "@/components/common/CustomCenterModal/CustomCenterModal";
import CourseTariffList from "@/components/UI/Courses/CourseTariffList/CourseTariffList";
import { useAppSelector } from "@/redux/hooks";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import CoursesNotFound from "@/components/UI/Courses/CoursesNotFound/CoursesNotFound";

const Page = () => {
    const user = useAppSelector(store => store.auth.user);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentCourseRequestId, setCurrentCourseRequestId] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);

    const { data: courses, isLoading: isCoursesLoading, isError: isCoursesError, refetch: refetchCourses } = useQuery({
        queryFn: () => {
            if (!user) return CoursesService.getCoursesByTagsAndSearch(selectedTag ? [selectedTag] : [], searchQuery);
            else return CoursesService.getRecommendedCourses(user?._id, selectedTag ? [selectedTag] : [], searchQuery);
        },
        queryKey: ['courses', selectedTag, searchQuery],
    });

    const { data: tags, isLoading: isTagsLoading, isError: isTagsError } = useQuery({
        queryFn: () => CoursesService.getUniqueTags(),
        queryKey: ['tags'],
    });

    const onCardClick = (id: string) => {
        setCurrentCourseRequestId(id);
        setModalOpen(true);
    }

    const debouncedRefetchCourses = useCallback(
        debounce(() => {
            refetchCourses();
        }, 300), // Задержка 300 мс
        [selectedTag, searchQuery, refetchCourses]
    );

    useEffect(() => {
        debouncedRefetchCourses();
    }, [selectedTag, searchQuery, debouncedRefetchCourses]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <>
            <CustomCenterModal onClose={() => setModalOpen(false)} isOpen={isModalOpen}>
                <CourseTariffList courseId={currentCourseRequestId}/>
            </CustomCenterModal>
            <div className={styles.coursesPage}>
                <div className={styles.coursesTitle}>
                    <h1>Каталог курсов Momentum</h1>
                </div>
                <div className={styles.controlsHeader}>
                    <div className={styles.tagsList}>
                        <div
                            className={`${styles.tag} ${!selectedTag ? styles.active : ''}`}
                            onClick={() => setSelectedTag(null)}
                        >
                            Все курсы
                        </div>
                        {isTagsLoading ? <Spinner animation="border" variant="primary"/> : tags && tags.map((tag: string) => (
                            <div
                                key={tag}
                                className={`${styles.tag} ${selectedTag === tag ? styles.active : ''}`}
                                onClick={() => setSelectedTag(tag)}
                            >
                                {tag}
                            </div>
                        ))}
                        <div
                            className={styles.resetButton}
                            onClick={() => { setSelectedTag(null); setSearchQuery(''); }}
                        >
                            Сбросить фильтры
                        </div>
                    </div>
                    <div className={styles.searchContainer}>
                        <SearchInput
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onDeleteClick={() => setSearchQuery("")}
                        />
                    </div>
                </div>
                <div className={styles.coursesListContainer}>
                    {
                    isCoursesLoading ? (
                            <div className={styles.loadingContainer}>
                                <Spinner animation="border" variant="primary"/>
                            </div>
                        ) :
                        <>
                            {
                                courses.length  !== 0 ?
                                <div className={styles.coursesList}>
                                    {courses && Array.isArray(courses) && (
                                        courses.map(course => (
                                            <CoursesDisplayCard
                                                key={course._id}
                                                course={course}
                                                onClick={() => onCardClick(course._id)}
                                            />
                                        ))
                                    )
                                    }
                                </div>
                                    : <CoursesNotFound/>
                            }
                        </>
                    }
                </div>
                <div className={styles.description}>
                    Онлайн-курсы по графическому дизайну для профессионалов помогут улучшить ваши знания и навыки, повысить квалификацию в профессии. Вы сможете выбрать курс по продолжительности, уровню нагрузки и специализации. Опытные преподаватели и эксперты в индустрии дизайна помогут освоить новые техники и инструменты. Вы будете изучать продвинутую теорию, выполнять практические задания и проходить тесты для закрепления знаний.
                </div>
            </div>
        </>
    );
};

export default Page;