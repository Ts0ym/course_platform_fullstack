import {useRouter} from "next/navigation";
import {AuthService} from "@/services/authService";
import {useEffect} from "react";

const useRoleCheck = (role: string) => {
    const router = useRouter()
    useEffect(() => {
        const checkRole = async () => {
            const response = await AuthService.checkAuth();
            if (!response || response.role !== role) {
                router.push('/');
            }
        };

        checkRole();
    }, [role, router])
}

export default useRoleCheck