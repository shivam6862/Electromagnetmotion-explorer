import React, { useContext } from "react";
import styles from "../../styles/explorer/setUp.module.css";
import { BsUsbDriveFill } from "react-icons/bs";
import { FaHourglassStart } from "react-icons/fa6";
import { useNotification } from "../../hook/useNotification";
import ArduinoContext from "../../store/arduino/arduino-context";
import { useRouter } from "next/router";

const SetUp = ({ heading, paragraph, link }) => {
  const { NotificationHandler } = useNotification();
  const arduinoCtx = useContext(ArduinoContext);
  const router = useRouter();

  const handleConnectSerial = async () => {
    try {
      const response = await window.webSerialApi.requestSerialPort();
      console.log(response);
      if (response.type == "Success")
        arduinoCtx.onaddWebSerialAPI(response.message, response.type);
      else if (response.type == "Error") {
        arduinoCtx.onaddWebSerialAPI("Port not found", response.type);
        NotificationHandler(
          "ElectroMagnetMotion Explorer",
          response.message,
          response.type
        );
      }
    } catch (error) {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        error.message,
        "Warn"
      );
    }
  };

  const isConnectedWebSerialApiHandle = () => {
    if (arduinoCtx.webSerialAPI.status == "Success") {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        "Connected to USB",
        "Success"
      );
      router.push("/home");
    } else {
      router.push("/home");
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        "Please connect the USB first",
        "Warn"
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1>{heading}</h1>
      <p>{paragraph}</p>
      <div className={styles["links-container"]}>
        <div
          onClick={isConnectedWebSerialApiHandle}
          className={styles["get-start"]}
        >
          <FaHourglassStart />
          Get Started
        </div>
        <button
          className={styles.play}
          onClick={handleConnectSerial}
          disabled={arduinoCtx.webSerialAPI.status == "Success"}
        >
          <BsUsbDriveFill />
          Connect USB
        </button>
      </div>
    </div>
  );
};

export default SetUp;
