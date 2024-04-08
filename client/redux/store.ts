import {combineReducers} from "redux";
import authSlice from "@/redux/slices/authSlice";
import {configureStore} from "@reduxjs/toolkit";
import { persistStore,
    persistReducer
} from "redux-persist"
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";

const createNoopStorage = () => {
    return {
        getItem(_key: any){
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any){
            return Promise.resolve(value);
        },
        removeItem(_key: any){
            return Promise.resolve();
        }
    }
}

const storage =
    typeof window !== 'undefined'
    ? createWebStorage('local')
        : createNoopStorage()



const rootReducer = combineReducers({
    [authSlice.name]: authSlice.reducer
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [authSlice.name]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeConfiguredStore = () =>
    configureStore({
        reducer: rootReducer,
    })

export const makeStore = () => {
    const isServer = typeof window === 'undefined'
    if (isServer) {
        return makeConfiguredStore()
    } else {
        const persistedReducer = persistReducer(persistConfig, rootReducer)
        let store: any = configureStore({
            reducer: persistedReducer,
            middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
        })
        store.__persistor = persistStore(store)
        return store
    }
}


export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<AppStore["getState"]>