import {Id, toast, TypeOptions} from "react-toastify";
import {MutableRefObject} from "react";

export class NotificationsService {

    private static toastId: Id | undefined;
    public static showNotification(message: string, type: TypeOptions) {
        if (this.toastId === undefined) {
            this.toastId = toast(message, {
                type: type,
                position: "bottom-left",
                onClose: () => {
                    this.toastId = undefined;
                },
            });
        } else {
            toast.update(this.toastId, {
                render: message,
                type: type,
            });
        }
    }
}