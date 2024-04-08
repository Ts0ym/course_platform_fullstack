import {useAppSelector} from "@/redux/hooks";
import {useRouter} from "next/navigation";

const useRoleCheck = (role: string) => {
    const user = useAppSelector(store => store.auth.user)
    const router = useRouter()

    if(user.role !== role){
        router.push('/404')
    }
    console.log(user)
}

export default useRoleCheck