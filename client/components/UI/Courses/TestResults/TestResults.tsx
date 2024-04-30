import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";

const TestResults = ({userId, lessonId} : {lessonId: string, userId: string}) => {

    const {data, isLoading, isError} = useQuery({
        queryFn: () =>
            CoursesService.getTestResult(userId, lessonId)
        ,
        queryKey: ['testResult']
    })

    return (
        <div>
            <p>Ваши верные ответы: {data?.score} из {data?.answers?.length}</p>
        </div>
    );
};

export default TestResults;