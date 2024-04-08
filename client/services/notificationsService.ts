import {Id, toast, TypeOptions} from "react-toastify";
import {MutableRefObject} from "react";

export class NotificationsService {
    public static showNotification(toastRef: MutableRefObject<Id | undefined>, message: string, type: TypeOptions) {
        if (toastRef.current === undefined) {
            toastRef.current = toast(message, {
                type: type,
                position: "bottom-left",
                onClose: () => {
                    toastRef.current = undefined;
                },
            });
        } else {
            toast.update(toastRef.current, {
                render: message,
                type: type,
            });
        }
    }
}