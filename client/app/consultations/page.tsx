'use client'
import React from 'react';
import ConsultationsRequestsList
    from "@/components/UI/Consultations/ConsultaionsRequestsList/ConsultationsRequestsList";
import ConsultationsUserPage from "@/components/UI/Consultations/ConsultationsUserPage/ConsultationsUserPage";
import {InlineWidget, useCalendlyEventListener} from "react-calendly";
import styles from "./ConsultationsPage.module.sass"
import BackButton from "@/components/common/BackButton/BackButton";
import {useAppSelector} from "@/redux/hooks";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {CoursesService} from "@/services/coursesService";
import MeetingsList from "@/components/UI/Meetings/MeetingsList/MeetingsList";
import {IUserInfo} from "@/types";
import {UsersService} from "@/services/usersService";
import {useRouter} from "next/navigation";

const Page = () => {

    const user = useAppSelector(store => store.auth.user)
    const router = useRouter()
    const queryClient = useQueryClient();
    const { data:meetings } = useQuery({
        queryFn: async () => CoursesService.getAllMeetingsByEmail(user?.email),
        queryKey: ["userMeetings"],
        placeholderData: []
    })

    const {data:userInfo, isPending, error} = useQuery<IUserInfo>({
        queryFn: async () => {
            if (!user?._id) return null;  // Предотвращаем запрос без необходимого ID
            return UsersService.getUserById(user._id);
        },
        queryKey: ['userInfo'],
        enabled: !!user?._id  // Активируем запрос только если ID пользователя доступен
    });

    useCalendlyEventListener({
        onEventScheduled: (e) => {
            console.log(e.data.payload)
            return setTimeout(() => queryClient.invalidateQueries({ queryKey: ["userMeetings"]}), 2000);
        }
    })

    return (
        <div className={styles.page}>
            <BackButton/>
            <div className={styles.tokensInfo}>
                <h1 className={styles.title}>У вас осталось бесплатных консультаций: {userInfo?.consultationTokens}</h1>
                <h2>Приобрести консультации можно за монеты в <span className={styles.shopRedirect} onClick={() => router.push('shop')}>магазине</span></h2>
            </div>
            {meetings?.length > 0 && <MeetingsList meetings={meetings}/>}
            <h1 className={styles.title}>Назначить новую консультацию</h1>
            <div className={styles.calendlyWrapper}>
                <InlineWidget
                    prefill={{
                        email: user?.email,
                        name: `${user?.name} ${user?.surname}`,
                    }}
                    url="https://calendly.com/tsoymaksimi2002"
                />
            </div>
        </div>
    );
};

export default Page;