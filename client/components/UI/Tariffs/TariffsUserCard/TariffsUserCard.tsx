import React from 'react';
import {ITariff} from "@/types";
import styles from './TariffsUserCard.module.sass';
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {PaymentService} from "@/services/paymentService";
import {useAppSelector} from "@/redux/hooks";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faBolt} from "@fortawesome/free-solid-svg-icons";

const TariffsUserCard = ({tariff} : {tariff: ITariff}) => {

    const user = useAppSelector(store => store.auth.user)
    const onPayBtnClick = async () => {
        const data = await PaymentService.handlePayment(user._id, tariff.course, tariff._id, tariff.price)
        if (data.confirmation && data.confirmation.confirmation_url) {
            window.open(data.confirmation.confirmation_url, '_blank');
        }
    }

    return (
        <div className={styles.card}>
            <h1 className={styles.name}>{tariff.name}</h1>
            <p className={styles.description}>{tariff.description}</p>
            <p className={styles.duration}>
                <FontAwesomeIcon icon={faBolt} className={styles.boltIcon}/>
                <strong>Длительность доступа:&nbsp;</strong>
                {tariff.duration} дней</p>
            {/*<p className={styles.price}><strong>Цена:</strong> {tariff.price} ₽</p>*/}
            {tariff.freeConsultations > 0 && (
                <p className={styles.consultations}>
                    <FontAwesomeIcon icon={faBolt} className={styles.boltIcon}/>
                    <strong>Бесплатные консультации:&nbsp;</strong>{" "}{tariff.freeConsultations}</p>
            )}
            <div className={styles.btnContainer}>
                <CustomButton color={"black"} onClick={() => onPayBtnClick()}>Оплатить {tariff.price}₽ <FontAwesomeIcon icon={faArrowRight}/></CustomButton>
            </div>
        </div>
    );
};

export default TariffsUserCard;