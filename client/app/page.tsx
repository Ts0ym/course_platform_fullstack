"use client"
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import useAuthCheck from "@/hooks/useAuthCheck";
import {ToastContainer} from "react-toastify";

export default function Home() {
  useAuthCheck();
  const user = useAppSelector(store => store.auth.user)
  return (
    <div>
      Welcome back! {user?.name}
    </div>
  );
}
