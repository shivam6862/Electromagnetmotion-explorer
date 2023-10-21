import "../styles/globals.css";
import { Oxanium } from "next/font/google";
const oxanium = Oxanium({ subsets: ["latin"] });
import Script from "next/script";
import Notifications from "../component/notification/Notifications";
import { NotificationContextProvider } from "../store/notification/Notification-context";

export default function MyApp({ Component, pageProps }) {
  return (
    <NotificationContextProvider>
      <Notifications />
      <Component {...pageProps} className={oxanium.className} />
      <Script />
    </NotificationContextProvider>
  );
}
