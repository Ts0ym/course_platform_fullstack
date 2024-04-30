import React, {useState} from "react";

export interface FormValues {
    [key: string]: any;
}

export interface FormErrors {
    [key: string]: string;
}

export interface UseFormReturn {
    values: FormValues;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLSelectElement>) => void;
    handleBlur: () => void;
    handleSubmit: (event: React.FormEvent<any>) => void;
    errors: FormErrors;
    setErrors: (errors: FormErrors) => void;
}

export function useForm(
    initialValues: FormValues,
    validate: (values: FormValues) => FormErrors): UseFormReturn
{
    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>) => {
        const {id, value} = event.target;
        setValues({...values, [id]: value});
    }

    const handleBlur = () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            console.log("Form is valid: Submitting", values);
        }
    };

    return {
        values,
        handleChange,
        handleBlur,
        errors,
        setErrors,
        handleSubmit
    }
}