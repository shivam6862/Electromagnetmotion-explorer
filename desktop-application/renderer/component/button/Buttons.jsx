import React, { useState, useEffect } from "react";
import Button from "./Button";
import { PiPlugsConnectedBold } from "react-icons/pi";
import {
  BsFillSendPlusFill,
  BsFillSkipStartCircleFill,
  BsSignStopFill,
} from "react-icons/bs";
import { AiFillRead } from "react-icons/ai";
import { IoStopwatchOutline } from "react-icons/io5";
import classes from "../../styles/button/buttons.module.css";
import { useNotification } from "../../hook/useNotification";
import socketIoClient from "socket.io-client";
let interval;

const Buttons = ({ sendCharacter }) => {
  const { NotificationHandler } = useNotification();
  const [webSerialId, setWebSerialId] = useState("NO");
  const [readCharacter, setReadCharacter] = useState("R");
  const [isReadButtonActive, setIsReadButtonActive] = useState(true);
  const [allvalueOfAngle, setallvalueOfAngle] = useState([]);

  const BUTTONS = [
    "Web Serial API",
    "Send character",
    "Start work",
    "Stop work",
    "Read character",
    "Stop Reading",
  ];
  const ICONS = [
    <PiPlugsConnectedBold />,
    <BsFillSendPlusFill />,
    <BsFillSkipStartCircleFill />,
    <BsSignStopFill />,
    <AiFillRead />,
    <IoStopwatchOutline />,
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
    setIsReadButtonActive(false);
    try {
      interval = setInterval(async () => {
        try {
          const response = await window.webSerialApi.readSerialPort();
          console.log(response);
          if (response.message !== undefined) {
            setReadCharacter(response.message);
            setallvalueOfAngle((prev) => [...prev, response.message]);
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
      }, 10);
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
  const handleStopReadCharacter = async () => {
    console.log(allvalueOfAngle);
    clearInterval(interval);
    setIsReadButtonActive(true);
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

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const establishSocketConnection = async () => {
      const socket = socketIoClient(`http://127.0.0.1:8000`, {});
      console.log(socket);
      setSocket(socket);
      socket.emit("serialData", "value");
      socket.on("messagesForYou", (response) => {
        console.log(response);
      });
      socket.on("messagesUpdated", (response) => {
        console.log(response);
      });
    };
    establishSocketConnection();
  }, []);

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
        <Button
          heading={BUTTONS[5]}
          icon={ICONS[5]}
          dataShow={""}
          onClick={handleStopReadCharacter}
          disabled={isReadButtonActive}
        />
      </div>
    </div>
  );
};

export default Buttons;
