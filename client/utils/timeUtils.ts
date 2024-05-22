import { intlFormatDistance, parseISO} from "date-fns";
import { format } from 'date-fns-tz';
import {ru} from "date-fns/locale";

export const GetFormattedTimeFromString = (time: string) => {
    return intlFormatDistance(
        new Date(time),
        Date.now(),
        {locale: 'ru', numeric: "auto"}
    )
}

export const GetFormattedDate = (date: Date | undefined | string) => {

    if(!date) return ""

    return format(new Date(date), "d MMMM 'в' HH:mm", { locale: ru });
}

function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date) {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export function GetFormatDateTimeRange(startDate: Date, endDate: Date) {
    const startDayOfWeek = startDate.toLocaleDateString('ru-RU', { weekday: 'long' });
    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);
    const dateStr = formatDate(startDate);

    return `${startDayOfWeek}, ${dateStr} ${startTime} - ${endTime}`;
}