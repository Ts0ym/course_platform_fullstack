'use client'
import React, {ChangeEvent, useState} from 'react';
import styles from "./CreateLessonForm.module.sass"
import CustomInput from "@/components/common/CustomInput/CustomInput";
import FileUploader from "@/components/common/FileUpload/FileUpload";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {ILessonQuestion, LessonType} from "@/types";
import CustomSelect from "@/components/common/CustomSelect/CustomSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import CreateQuestionForm from "@/components/UI/Courses/CreateQuestionForm/CreateQuestionForm";
import QuestionCard from "@/components/UI/Courses/QuestionCard/QuestionCard";
import CustomCheckbox from "@/components/common/CustomCheckbox/CustomCheckbox";
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';
import dynamic from "next/dynamic";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";

interface CreateLessonFormProps {
    onSubmit: (formData: any) => void
}
const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false } // Отключаем серверный рендеринг для компонента Editor
);
const CreateLessonForm = ({ onSubmit } : CreateLessonFormProps) => {

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [video, setVideo] = useState<File | null>(null);
    const [lessonType, setLessonType] = useState<LessonType>("video");
    const [textContent, setTextContent] = useState<string>("");
    const [quizQuestions, setQuizQuestions] = useState<ILessonQuestion[]>([])
    const [isCreateQuestionShow, setIsCreateQuestionShow] = useState<boolean>(false);
    const [reward, setReward] = useState<string>("0");
    const [homework, setHomework] = useState<boolean>(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [homeworkText, setHomeworkText] = useState<string>("");

    const onUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setVideo(file);
            }
        }
    }

    const handleChangeReward = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Убедитесь, что значение является числовым или пустым строковым значением
        if (!val || /^\d+$/.test(val)) {
            setReward(val);
        }
    };

    const createFormData = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("type", lessonType);
        formData.append("description", description);
        formData.append("reward", reward.toString());
        formData.append("homework", homework.toString());

        switch(lessonType){
            case "video":
                video && formData.append("video", video);
                break;
            case "text":
                formData.append("text", stateToHTML(editorState.getCurrentContent()))
                break;
            case "quiz":
                formData.append("questions", JSON.stringify(quizQuestions));
                break;
        }

        if(homework){
            formData.append("homeworkText", homeworkText);
        }

        return formData;
    }

    const onCreateQuestionSubmit = (question: ILessonQuestion) => {
        setQuizQuestions([...quizQuestions, question]);
        setIsCreateQuestionShow(false);
    };

    const handleRemoveQuestion = (index: number) => {
        setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
    };

    const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
        setQuizQuestions(currentQuizQuestions => currentQuizQuestions.map((question, qIndex) => {
            if (qIndex === questionIndex) {
                const updatedOptions = question.options.filter((_, oIndex) => oIndex !== optionIndex);
                return { ...question, options: updatedOptions };
            }
            return question;
        }));
    };

    const handleEditorChange = (state: EditorState) => {
        setEditorState(state);
    };


    return (
        <div className={styles.createLessonForm}>
            <CustomInput
                placeholder={"Название урока"}
                value={title}
                onChange={e => setTitle(e.target.value)}
                title={"Добавьте название урока"}
                titleShow={true}
            />
            <CustomInput
                placeholder={"Описание урока"}
                value={description}
                onChange={e => setDescription(e.target.value)}
                title={"Добавьте описание урока"}
                titleShow={true}
            />
            <CustomSelect
                value={lessonType}
                options={[
                    {value: "video", label: "Видео"},
                    {value: "text", label: "Текст"},
                    {value: "quiz", label: "Тест"}]}
                onChange={(e) => setLessonType(e.target.value as LessonType)}
                title={"Выберите тип урока"}
                titleShow={true}
            />
            {
                lessonType === "video"
                && <div className={styles.videoUploadContainer}>
                    <FileUploader
                        onFileSelect={onUploadChange}
                        onFileDelete={() => setVideo(null)}
                        fileValue={video}
                        accept={'video/*'}
                    />
                </div>
            }
            {
                lessonType === "text"
                &&
                <>
                    <div className={styles.editorContainer}>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={handleEditorChange}
                            wrapperClassName={styles.wrapper}
                            editorClassName={styles.editor}
                            toolbarClassName={styles.toolbar}
                        />
                    </div>
                </>
            }
            {
                lessonType === "quiz"
                &&
                <div className={styles.addQuizContainer}>
                    {
                        <div>
                            <h1 className={styles.questionsHeader}>Вопросы теста:</h1>
                            {quizQuestions.map((question, index) =>
                                <QuestionCard
                                    key={index}
                                    questionData={question}
                                    onRemove={() => handleRemoveQuestion(index)}
                                    onRemoveOption={(optionIndex) => handleRemoveOption(index, optionIndex)}
                                />
                            )}
                        </div>
                    }
                    {
                        isCreateQuestionShow && <CreateQuestionForm
                            onSubmit={onCreateQuestionSubmit}
                            onCancel={() => setIsCreateQuestionShow(false)}
                        />
                    }
                    {
                        !isCreateQuestionShow &&
                        <CustomButton
                            onClick={() => {setIsCreateQuestionShow(true)}}
                            color={"black"}
                        >
                            <FontAwesomeIcon icon={faPlus}/> Добавить вопрос
                        </CustomButton>
                    }
                </div>
            }
            <CustomInput
                placeholder={''}
                title={"Добавьте награду за урок"}
                type={"number"}
                value={reward}
                onChange={handleChangeReward}
                titleShow={true}

            />
            {
                lessonType !== "quiz" &&
                <CustomCheckbox
                    label={"Нужно домашнее задание"}
                    value={homework}
                    onChange={(e) => setHomework(e.target.checked)}
                />
            }
            {
                homework
                && <CustomTextBox
                    value={homeworkText}
                    onChange={e => setHomeworkText(e.target.value)}
                    title={"Добавьте текст домашнего задания"}
                    titleShow={true}
                    placeholder={"Текст домашнего задания"}
                />
            }
            <CustomButton
                onClick={() => onSubmit(createFormData()) }
                color={"black"}>Сохранить урок</CustomButton>
        </div>
    );
};

export default CreateLessonForm;