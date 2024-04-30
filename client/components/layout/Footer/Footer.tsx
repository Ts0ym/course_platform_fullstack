import React from 'react';
import styles from './Footer.module.sass';
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faVk, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons"


const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footerInfo}>
                <div className={styles.footerLinks}>
                    <Link href={""}>Политика конфиденциальности</Link>
                    <Link href={""}>Пользовательское соглашение</Link>
                </div>
                <p>Momentum — онлайн-школа дизайна © 2024</p>
            </div>

            <div className={styles.rightInfo}>
                <div className={styles.supportLinks}>
                    <Link
                        href="/"
                        className={styles.supportLink}
                    >Помощь</Link>
                    <Link
                        href="/"
                        className={styles.supportLink}
                    >Служба поддержки</Link>
                    <Link
                        href="/bugreport"
                        className={styles.supportLink}
                    >Нашли баг? Сообщите нам</Link>
                </div>
                <div className={styles.footerSocials}>
                    <a
                        href="/"><FontAwesomeIcon
                        icon={faInstagram}
                    /></a>
                    <a
                        href="/"><FontAwesomeIcon
                        icon={faVk}
                    /></a>
                    <a
                        href="/"><FontAwesomeIcon
                        icon={faYoutube}
                    /></a>
                </div>
            </div>
        </div>
    );
};

export default Footer;