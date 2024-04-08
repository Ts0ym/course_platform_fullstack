import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IUser} from "@/types/UsersTypes";



interface AuthState {
    isAuthenticated: boolean;
    user: IUser | null; // Здесь может быть ваш объект пользователя
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state: AuthState, action: PayloadAction<IUser>) {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout(state: AuthState) {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice;