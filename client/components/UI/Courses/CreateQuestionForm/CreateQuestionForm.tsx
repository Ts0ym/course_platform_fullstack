import React, { useState } from 'react';
import CustomInput from "@/components/common/CustomInput/CustomInput";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import styles from './CreateQuestionForm.module.sass';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {ILessonQuestion} from "@/types";

interface AnswerListProps {
    answers: string[];
    onAnswerChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    onRemoveAnswer: (index: number) => void;
}

const AnswerList: React.FC<AnswerListProps> = ({ answers, onAnswerChange, onRemoveAnswer }) => (
    <div className={styles.answersList}>
        {answers.map((ans, index) => (
            <div key={index} className={styles.answerItem}>
                <FontAwesomeIcon
                    icon={faXmark}
                    onClick={() => onRemoveAnswer(index)}
                    className={styles.removeButton}
                />
                <CustomInput
                    placeholder={`Ответ ${index + 1}`}
                    value={ans}
                    onChange={(e) => onAnswerChange(e, index)}
                    title={`Ответ ${index + 1}`}
                />
            </div>
        ))}
    </div>
);

interface CreateQuestionFormProps {
    onSubmit: (question: ILessonQuestion) => void;
    onCancel: () => void;
}

const CreateQuestionForm = ({ onSubmit, onCancel } : CreateQuestionFormProps) => {
    const [question, setQuestion] = useState<string>("");
    const [correctAnswer, setCorrectAnswer] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [answers, setAnswers] = useState<string[]>([]);

    const handleAddAnswer = () => {
        if (answer.trim() !== "") {
            setAnswers(prevAnswers => [...prevAnswers, answer.trim()]);
            setAnswer("");
        }
    };

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = e.target.value;
        setAnswers(updatedAnswers);
    };

    const handleRemoveAnswer = (index: number) => {
        const updatedAnswers = answers.filter((_, i) => i !== index);
        setAnswers(updatedAnswers);
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.zoneTitle}>Добавьте вопросы теста</h2>
            <CustomInput
                placeholder="Введите вопрос"
                value={question}
                onChange={e => setQuestion(e.target.value)}
            />
            <CustomInput
                placeholder="Введите правильный ответ"
                value={correctAnswer}
                onChange={e => setCorrectAnswer(e.target.value)}
            />
            <h3 className={styles.zoneTitle}>Варианты ответов:</h3>
            <AnswerList answers={answers} onAnswerChange={handleAnswerChange} onRemoveAnswer={handleRemoveAnswer} />
            <CustomInput
                placeholder="Добавление варианта ответа"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
            />
            <CustomButton onClick={handleAddAnswer} color="black"><FontAwesomeIcon icon={faPlus}/>Создать вариант ответа</CustomButton>
            <div className={styles.controls}>
                <div>
                    <CustomButton
                        onClick={() => {
                            onSubmit({question, correctAnswer, options: answers});
                            setQuestion("");
                            setCorrectAnswer("");
                            setAnswers([]);
                        }}
                        color="black"
                    >
                        Сохранить вопрос
                    </CustomButton>
                </div>
                <div>
                    <CustomButton onClick={onCancel} color="red">Отмена</CustomButton>
                </div>
            </div>
        </div>
    );
};

export default CreateQuestionForm;
