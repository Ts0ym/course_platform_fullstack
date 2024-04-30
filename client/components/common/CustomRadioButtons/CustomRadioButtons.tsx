import React from 'react';
import styles from './CustomRadioButton.module.sass'

interface RadioOptions {
    label: string; // Отображаемый текст рядом с радио-кнопкой
    value: string; // Значение радио-кнопки
}

interface RadioButtonsProps {
    options: RadioOptions[]; // Массив опций
    name: string; // Имя группы радио-кнопок
    selectedValue: string; // Текущее выбранное значение
    onChange: (value: any) => void; // Функция для обработки изменений
}

const CustomRadioButtons = ({ options, name, selectedValue, onChange } : RadioButtonsProps) => {
    return (
        <>
            {options.map(option => (
                <label key={option.value} className={styles.radio}>
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={() => onChange(option.value)}
                        style={{ marginRight: "10px" }} // Добавьте небольшой отступ для визуального разделения
                    />
                    {option.label}
                </label>
            ))}
        </>
    );
};

export default CustomRadioButtons;