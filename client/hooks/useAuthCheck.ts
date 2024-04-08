import {useAppDispatch} from "@/redux/hooks";
import {useEffect} from "react";
import {localStorageService} from "@/services/localStorageService";
import {AuthService} from "@/services/authService";
import {logout} from "@/redux/slices/authSlice";
import {useRouter} from "next/navigation";

const useAuthCheck = () => {
    const appDispatch = useAppDispatch();
    const router = useRouter();
    useEffect(() => {
        if (localStorageService.getRefreshToken()) {
            AuthService.checkAuth()
                .then(() => {
                    console.log("Logged in")
                    return true
                })
                .catch(() => {
                    appDispatch(logout());
                    console.log("Logged out");
                    router.push("/auth/login");
                    return false
                })
        }
    }, []);
};

export default useAuthCheck;