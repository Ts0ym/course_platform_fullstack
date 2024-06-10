'use client'
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/redux/hooks';
import { ShopService } from '@/services/shopService';
import { UsersService } from '@/services/usersService';
import { NotificationsService } from '@/services/notificationsService';
import styles from './ShopPage.module.sass';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCartShopping, faCoins, faStore} from "@fortawesome/free-solid-svg-icons";
import BackButton from "@/components/common/BackButton/BackButton";
import CustomButton from "@/components/common/CustomButton/CustomButton";
import {API_URL} from "@/constants";
import Image from "next/image";

const ShopPage = () => {
    const user = useAppSelector(store => store.auth.user);
    const queryClient = useQueryClient();
    const [items, setItems] = useState([]);
    const [balance, setBalance] = useState(0);

    const { data: shopItems, isLoading: isLoadingItems } = useQuery({
        queryKey: ['shopItems'],
        queryFn: ShopService.getItems,
    });

    const { data: userData, isLoading: isLoadingUser } = useQuery({
        queryKey: ['user', user._id],
        queryFn: () => UsersService.getUserById(user._id)
    });

    useEffect(() => {
        if (shopItems) {
            setItems(shopItems);
        }
    }, [shopItems]);

    useEffect(() => {
        if (userData) {
            setBalance(userData.balance);
        }
    }, [userData]);

    const purchaseMutation = useMutation({
        mutationFn: (itemId: string) => ShopService.purchaseItem(user._id, itemId),
        onSuccess: () => {
            NotificationsService.showNotification('Purchase successful!', 'success');
            queryClient.invalidateQueries({queryKey:['user', user._id
        ]
        });
        },
        onError: (error: any) => {
            NotificationsService.showNotification('Purchase failed: ' + error.response?.data?.message, 'error');
        },
    });

    const handlePurchase = (itemId: string) => {
        purchaseMutation.mutate(itemId);
    };

    if (isLoadingItems || isLoadingUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.shopPage}>
            <BackButton/>
            <div className={styles.header}>
                <h1><FontAwesomeIcon icon={faStore}/> Магазин бонусов Momentum</h1>
                <div className={styles.balance}>
                    <p>Ваш баланс: {balance} <FontAwesomeIcon icon={faCoins} className={styles.coinsIcon}/></p>
                </div>
            </div>
            <h2 className={styles.itemsHeader}>Доступные бонусы</h2>
            <div className={styles.itemsList}>
                {items.map((item: any) => (
                    <div key={item._id} className={styles.itemCard}>
                        {!item.enable && <div className={styles.unenableIcon}><FontAwesomeIcon icon={faBan} className={styles.disabledIcon}/> Временно недоступно</div>}
                        <Image
                            src={API_URL + "image/" + item.icon}
                            alt={"image"}
                            className={styles.achievementIcon}
                            width={200}
                            height={200}
                            layout="responsive"
                        />
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <p className={styles.price}>{item.price} <FontAwesomeIcon icon={faCoins} className={styles.coinsIcon}/></p>
                        {/*<button onClick={() => handlePurchase(item._id)}>Purchase</button>*/}
                        <CustomButton
                            onClick={() => handlePurchase(item._id)}
                            color={'black'}><FontAwesomeIcon icon={faCartShopping}/>Купить</CustomButton>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;
