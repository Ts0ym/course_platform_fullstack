import React, {useState} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/ru';
import {useQuery} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import {IConsultationRequest} from "@/types";

moment.locale('ru');
const localizer = momentLocalizer(moment);

const messages = {
    today: 'Сегодня',
    next: 'Следующий',
    previous: 'Предыдущий',
    month: 'Месяц',
    week: 'Неделя',
    day: 'День',
    agenda: 'Повестка дня'
};

const ConsultationsAdminPage = () => {

    const {data} = useQuery<IConsultationRequest[]>({
        queryFn: async () => CoursesService.getApprovedConsultationRequests(),
        queryKey: ['consultationRequests']
    })

    const dataToEvent = (data: IConsultationRequest) => {
        // Преобразование дат в местное время
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
        end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

        return {
            title: `Консультация с ${data.user.name} ${data.user.surname}`,
            start,
            end,
        }
    }

    const events = data?.map(dataToEvent);

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ margin: '50px' }}
                messages={messages}
            />
        </div>
    );
};

const renderEventContent = (eventInfo: any) => {
    return (
        <div>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </div>
    );
};

export default ConsultationsAdminPage;