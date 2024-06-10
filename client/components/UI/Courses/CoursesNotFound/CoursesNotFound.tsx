import React from 'react';
import Image from "next/image";
import styles from  "./CoursesNotFound.module.sass";

const CoursesNotFound = () => {
    return (
        <div className={styles.container}>
            <Image src={"/images/coursenotfound.png"} alt={"logo"} width={300} height={300} />
            <h1>К сожалению, курсы по такому запросу не найдены</h1>
            <h2>Но есть более 10 других!</h2>
        </div>
    );
};

export default CoursesNotFound;