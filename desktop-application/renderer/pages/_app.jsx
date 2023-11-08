import "../styles/globals.css";
import { Oxanium } from "next/font/google";
const oxanium = Oxanium({ subsets: ["latin"] });
import Script from "next/script";
import Notifications from "../component/notification/Notifications";
import { NotificationContextProvider } from "../store/notification/Notification-context";
import { ArduinoContextProvider } from "../store/arduino/arduino-context";

export default function MyApp({ Component, pageProps }) {
  return (
    <NotificationContextProvider>
      <ArduinoContextProvider>
        <div className={oxanium.className}>
          <Notifications />
          <Component {...pageProps} />
          <Script />
        </div>
      </ArduinoContextProvider>
    </NotificationContextProvider>
  );
}
