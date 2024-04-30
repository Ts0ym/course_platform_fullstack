import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './QuestionCard.module.sass';
import { ILessonQuestion } from "@/types";
import CustomButton from "@/components/common/CustomButton/CustomButton";

interface QuestionCardProps {
    questionData: ILessonQuestion;
    onRemove: () => void;
    onRemoveOption: (optionIndex: number) => void; // Обновлено для удаления только по индексу варианта ответа
}

const QuestionCard: React.FC<QuestionCardProps> = ({ questionData, onRemove, onRemoveOption }) => {
    return (
        <div className={styles.questionCard}>
            <div className={styles.questionContent}>
                <div className={styles.questionText}><strong>Вопрос:</strong> {questionData.question}</div>
                <div className={styles.correctAnswer}><strong>Правильный ответ:</strong> {questionData.correctAnswer}</div>
                <div className={styles.options}>
                    <p>Варианты ответов:</p>
                    <ul>
                        {questionData.options.map((option, optionIndex) => (
                            <li key={optionIndex} className={styles.optionItem}>
                                {option}
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className={styles.removeOptionButton}
                                        onClick={() => onRemoveOption(optionIndex)}
                                    />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.removeButtonContainer}>
                <CustomButton onClick={onRemove} color={'white'}>
                    <FontAwesomeIcon icon={faTrash} />
                </CustomButton>
            </div>
        </div>
    );
};

export default QuestionCard;
