// components/TestComponent.tsx
import React, { useState } from 'react';
import styles from './TestComponent.module.sass';
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {CoursesService} from "@/services/coursesService";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export interface LessonQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface TestComponentProps {
    questions: LessonQuestion[];
    userId: string;
    lessonId: string;
    courseId: string;
}

const TestComponent: React.FC<TestComponentProps> = ({ questions, lessonId, userId, courseId}) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async () => {
            submitTestResults()
            await CoursesService.completeLesson({userId,  lessonId, courseId})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ['courseWithProgress']})
        }

    })
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>(new Array(questions.length).fill(''));
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (option: string) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = option;
        setUserAnswers(updatedAnswers);
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const calculateResult = () => {
        const score = userAnswers.reduce((acc, answer, index) => {
            return acc + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
        return score;
    };

    const submitTestResults = () => {
        const score = calculateResult();
        // alert(`Your score: ${score}/${questions.length}`);

        // Prepare test results data
        const results = {
            userId,
            lessonId,
            answers: questions.map((question, index) => ({
                question: question.question,
                selectedOption: userAnswers[index],
                isCorrect: userAnswers[index] === question.correctAnswer
            })),
            score
        };

        // Call the service to submit the results
        CoursesService.submitTestResults(results).then(response => {
            console.log('Test results submitted successfully:', response);
        }).catch(error => {
            console.error('Failed to submit test results:', error);
        });
    };

    return (
        <div className={styles.testContainer}>
            <h2>{currentQuestion.question}</h2>
            <div className={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className={`${styles.option} ${userAnswers[currentQuestionIndex] === option ? styles.selectedOption : ''}`}
                    >
                        <span>{index + 1}</span>{option}
                    </button>
                ))}
            </div>

            <div className={styles.navigationButtons}>
                {currentQuestionIndex > 0 && userAnswers[currentQuestionIndex - 1] && (
                    <div className={styles.backButtonContainer}>
                        <CustomButton onClick={goToPreviousQuestion} color={"black"}>
                            Предыдущий вопрос
                        </CustomButton>
                    </div>
                )}
                {currentQuestionIndex < questions.length - 1 && userAnswers[currentQuestionIndex] && (
                    <div className={styles.nextButtonContainer}>
                        <CustomButton onClick={goToNextQuestion} color={"black"}>
                            Следующий вопрос
                        </CustomButton>
                    </div>
                )}
                {currentQuestionIndex === questions.length - 1 && userAnswers[currentQuestionIndex] && (
                    <div className={styles.nextButtonContainer}>
                        <CustomButton onClick={() => mutation.mutate()}
                                      color={"black"}
                        >
                            Завершить тест
                        </CustomButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestComponent;
