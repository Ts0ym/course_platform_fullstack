import {useAppDispatch} from "@/redux/hooks";
import {useRouter} from "next/navigation";
import {AuthService} from "@/services/authService";
import {logout} from "@/redux/slices/authSlice";

export default function useLogout() {
    const appDispatch = useAppDispatch();
    const router = useRouter();
    const handleLogout = async () => {
        await AuthService.logout();
        appDispatch(logout());
        router.push("/auth/login");
    };

    return handleLogout;
}