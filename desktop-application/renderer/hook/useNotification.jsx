import { useContext } from "react";
import NotificationContext from "../store/notification/Notification-context";
import { HiOutlineCheck } from "react-icons/hi";
import { AiOutlineInfo } from "react-icons/ai";
import { PiWarningCircleDuotone } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";

const backGroundColor = {
  Success: "linear-gradient(95deg, #32BB71 15.3%, #2A9D8F 113.45%)",
  Error: "linear-gradient(95deg, #F6743E -6.96%, #D42525 108.25%)",
  Info: "linear-gradient(94deg, #2D82B2 -6.52%, #329ABB 108.61%)",
  Warn: "linear-gradient(93deg, #F8B806 -30.52%, #FF8C04 123.88%)",
};

const logoNotification = {
  Success: <HiOutlineCheck />,
  Error: <AiOutlineInfo />,
  Info: <PiWarningCircleDuotone />,
  Warn: <RxCross2 />,
};

export const useNotification = () => {
  const notificationCtx = useContext(NotificationContext);
  const NotificationHandler = (title, message, status) => {
    const color = backGroundColor[status];
    const logo = logoNotification[status];
    notificationCtx.onMessage(title, message, color, logo);
  };
  return { NotificationHandler };
};
