"use client"

import React, {useEffect, useState} from 'react';
import {AchievementService} from "@/services/achievementsService";
import {useAppSelector} from "@/redux/hooks";
import {IAchievement} from "@/types";
import styles from "./AchievementsPage.module.sass"
import {API_URL} from "@/constants";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import BackButton from "@/components/common/BackButton/BackButton";

const AchievementsPage = () => {
    const user = useAppSelector(store => store.auth.user);
    const [achievements, setAchievements] = useState<IAchievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            AchievementService.getUserAchievements(user._id)
                .then(data => {
                    setAchievements(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching achievements:', error);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.achievementsPage}>
            <BackButton/>
            <h1>Все достижения</h1>
            <div className={styles.achievementsList}>
                {achievements.map(achievement => (
                    <div key={achievement._id} className={styles.achievementCard}>
                        {achievement.achieved ? (
                            // <img src={`/uploads/${achievement.icon}`} alt={achievement.title} className={styles.achievementIcon} />
                            <Image
                                src={API_URL + "image/" + achievement.icon}
                                alt={"image"}
                                className={styles.achievementIcon}
                                width={100}
                                height={100}
                                // layout="responsive"
                            />
                        ) : (
                            <div className={styles.lockedAchievement}>
                                {/*<img src="/icons/lock.png" alt="Locked" className={styles.lockIcon} />*/}
                                <FontAwesomeIcon icon={faLock} className={styles.lockIcon}/>
                            </div>
                        )}
                        <div className={styles.achievementInfo}>
                            <h2>{achievement.title}</h2>
                            <p>{achievement.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsPage;