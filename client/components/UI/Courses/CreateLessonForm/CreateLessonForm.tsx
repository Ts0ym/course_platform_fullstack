import React, {ChangeEvent} from 'react';
import styles from "./CreateLessonForm.module.sass"
import CustomInput from "@/components/common/CustomInput/CustomInput";
import FileUploader from "@/components/common/FileUpload/FileUpload";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {ILessonQuestion, LessonType} from "@/types";
import CustomSelect from "@/components/common/CustomSelect/CustomSelect";
import CustomTextBox from "@/components/common/ CustomTextBox/CustomTextBox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import CreateQuestionForm from "@/components/UI/Courses/CreateQuestionForm/CreateQuestionForm";
import QuestionCard from "@/components/UI/Courses/QuestionCard/QuestionCard";

interface CreateLessonFormProps {
    onSubmit: (formData: any) => void
}

const CreateLessonForm = ({ onSubmit } : CreateLessonFormProps) => {

    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [video, setVideo] = React.useState<File | null>(null);
    const [lessonType, setLessonType] = React.useState<LessonType>("video");
    const [textContent, setTextContent] = React.useState<string>("");
    const [quizQuestions, setQuizQuestions] = React.useState<ILessonQuestion[]>([])
    const [isCreateQuestionShow, setIsCreateQuestionShow] = React.useState<boolean>(false);
    const [reward, setReward] = React.useState<number>(0);

    const onUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setVideo(file);
            }
        }
    }

    const createFormData = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("type", lessonType);
        formData.append("description", description);
        formData.append("reward", reward.toString());

        switch(lessonType){
            case "video":
                video && formData.append("video", video);
                break;
            case "text":
                formData.append("text", textContent);
                break;
            case "quiz":
                formData.append("questions", JSON.stringify(quizQuestions));
                break;
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
                && <FileUploader
                    onFileSelect={onUploadChange}
                    onFileDelete={() => setVideo(null)}
                    fileValue={video}
                    accept={'video/*'}
                />
            }
            {
                lessonType === "text"
                && <CustomTextBox
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                    placeholder={"Текст урока"}
                    title={"Добавьте текст урока"}
                    titleShow={true}
                />
            }
            {
                lessonType === "quiz"
                &&
                <div>
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
                            color={'blue'}
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
                onChange={e => setReward(Number(e.target.value))}
                titleShow={true}

            />
            <CustomButton onClick={() =>
                onSubmit(createFormData()) } color={"blue"}>Сохранить урок</CustomButton>
        </div>
    );
};

export default CreateLessonForm;