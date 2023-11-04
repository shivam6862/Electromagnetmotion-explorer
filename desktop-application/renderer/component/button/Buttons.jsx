import React, { useState } from "react";
import Button from "./Button";
import { PiPlugsConnectedBold } from "react-icons/pi";
import {
  BsFillSendPlusFill,
  BsFillSkipStartCircleFill,
  BsSignStopFill,
} from "react-icons/bs";
import { AiFillRead } from "react-icons/ai";
import classes from "../../styles/button/buttons.module.css";
import { useNotification } from "../../hook/useNotification";

const Buttons = ({ sendCharacter }) => {
  const { NotificationHandler } = useNotification();
  const [webSerialId, setWebSerialId] = useState("NO");
  const [readCharacter, setReadCharacter] = useState("R");
  const [isReadButtonActive, setIsReadButtonActive] = useState(true);

  const BUTTONS = [
    "Web Serial API",
    "Send character",
    "Start work",
    "Stop work",
    "Read character",
  ];
  const ICONS = [
    <PiPlugsConnectedBold />,
    <BsFillSendPlusFill />,
    <BsFillSkipStartCircleFill />,
    <BsSignStopFill />,
    <AiFillRead />,
  ];
  const handleConnectSerial = async () => {
    try {
      const response = await window.webSerialApi.requestSerialPort();
      if (response.type == "Success") setWebSerialId(response.message);
      else if (response.type == "Error")
        NotificationHandler(
          "ElectroMagnetMotion Explorer",
          response.message,
          response.type
        );
    } catch (error) {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        error.message,
        "Warn"
      );
    }
  };
  const handleSendCharacter = async () => {
    if (sendCharacter == "") {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        "Please fill a character!",
        "Info"
      );
      return;
    } else if (sendCharacter.length > 1) {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        "Fill a single character!",
        "Warn"
      );
      return;
    }
    try {
      const response = await window.webSerialApi.sendCharacterToSerialPort(
        sendCharacter
      );
      if (response.type == "Error")
        NotificationHandler(
          "ElectroMagnetMotion Explorer",
          response.message,
          response.type
        );
    } catch (error) {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        error.message,
        "Warn"
      );
    }
  };
  const handleReadCharacter = async () => {
    let interval;
    setIsReadButtonActive(false);
    try {
      interval = setInterval(async () => {
        try {
          const response = await window.webSerialApi.readSerialPort();
          if (response.message !== undefined) {
            setReadCharacter(response.message);
          }
        } catch (error) {
          NotificationHandler(
            "ElectroMagnetMotion Explorer",
            error.message,
            "Error"
          );
          clearInterval(interval);
          setIsReadButtonActive(true);
        }
      }, 2000);
    } catch (error) {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        error.message,
        "Info"
      );
      setIsReadButtonActive(true);
    } finally {
      return () => {
        clearInterval(interval);
        setIsReadButtonActive(true);
      };
    }
  };
  const handleStartWork = async () => {
    try {
      const response = await window.workApi.sendCharacterToStartWork("S");
      console.log(response);
      if (response.type == "Error")
        NotificationHandler(
          "ElectroMagnetMotion Explorer",
          response.message,
          response.type
        );
    } catch (error) {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        error.message,
        "Warn"
      );
    }
  };
  const handleStopWork = async () => {
    try {
      const response = await window.workApi.sendCharacterToEndWork("C");
      console.log(response);
      if (response.type == "Error")
        NotificationHandler(
          "ElectroMagnetMotion Explorer",
          response.message,
          response.type
        );
    } catch (error) {
      NotificationHandler(
        "ElectroMagnetMotion Explorer",
        error.message,
        "Warn"
      );
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <Button
          heading={BUTTONS[0]}
          icon={ICONS[0]}
          dataShow={webSerialId}
          onClick={handleConnectSerial}
        />
        <Button
          heading={BUTTONS[1]}
          icon={ICONS[1]}
          dataShow={"H"}
          onClick={handleSendCharacter}
        />
        <Button
          heading={BUTTONS[2]}
          icon={ICONS[2]}
          dataShow={"S"}
          onClick={handleStartWork}
        />
        <Button
          heading={BUTTONS[3]}
          icon={ICONS[3]}
          dataShow={"C"}
          onClick={handleStopWork}
        />
        <Button
          heading={BUTTONS[4]}
          icon={ICONS[4]}
          dataShow={readCharacter}
          onClick={handleReadCharacter}
          disabled={!isReadButtonActive}
        />
      </div>
    </div>
  );
};

export default Buttons;
