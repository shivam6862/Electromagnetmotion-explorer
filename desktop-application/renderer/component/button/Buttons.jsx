import React, { useState } from "react";
import Button from "./Button";
import { BsSignStopFill, BsFillSkipStartCircleFill } from "react-icons/bs";
import { AiFillRead } from "react-icons/ai";
import { IoStopwatchOutline } from "react-icons/io5";
import classes from "../../styles/button/buttons.module.css";
import { useNotification } from "../../hook/useNotification";
import usePYModels from "../../hook/usePYModels";

let interval;

const Buttons = ({
  chartDataState,
  setChartDataState,
  setPythonURLImage,
  setPreviousAllChartData,
}) => {
  const { generateImage } = usePYModels();
  const { NotificationHandler } = useNotification();
  const [readCharacter, setReadCharacter] = useState("R");
  const [isReadButtonActive, setIsReadButtonActive] = useState(true);

  const BUTTONS = ["Start work", "Stop work", "Read character", "Stop Reading"];
  const ICONS = [
    <BsFillSkipStartCircleFill />,
    <BsSignStopFill />,
    <AiFillRead />,
    <IoStopwatchOutline />,
  ];

  const handleReadCharacter = async () => {
    setChartDataState([]);
    setIsReadButtonActive(false);
    try {
      interval = setInterval(async () => {
        try {
          const response = await window.webSerialApi.readSerialPort();
          console.log("message", response.message);
          if (response.message !== undefined) {
            const inputString = response.message;
            let pairs = inputString.split("],");
            let arrayOfObjects = [];
            for (let i = 1; i < pairs.length - 1; i++) {
              let [angle, time] = pairs[i].split("[");
              let angleValue = parseFloat(angle);
              let timeInMillisec = parseInt(time);
              let obj = {
                angle: angleValue,
                timeInMillisec: timeInMillisec,
              };
              arrayOfObjects.push(obj);
            }
            console.log(arrayOfObjects);
            setReadCharacter(response.message);
            setChartDataState((prev) => [...prev, ...arrayOfObjects]);
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
      }, 100);
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
    clearInterval(interval);
    console.log(chartDataState);
    const response = await generateImage(chartDataState);
    console.log(response);
    setPythonURLImage([...response]);
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
      if (chartDataState.length > 0) {
        setPreviousAllChartData((prev) => [...prev, chartDataState]);
      }
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
          dataShow={"S"}
          onClick={handleStartWork}
        />
        <Button
          heading={BUTTONS[1]}
          icon={ICONS[1]}
          dataShow={"C"}
          onClick={handleStopWork}
        />
        <Button
          heading={BUTTONS[2]}
          icon={ICONS[2]}
          dataShow={readCharacter}
          onClick={handleReadCharacter}
          disabled={!isReadButtonActive}
        />
        <Button
          heading={BUTTONS[3]}
          icon={ICONS[3]}
          dataShow={""}
          onClick={handleStopReadCharacter}
          disabled={isReadButtonActive}
        />
      </div>
    </div>
  );
};

export default Buttons;
