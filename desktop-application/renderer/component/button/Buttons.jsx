import React, { useState } from "react";
import Button from "./Button";
import { BsSignStopFill, BsFillSkipStartCircleFill } from "react-icons/bs";
import { AiFillRead } from "react-icons/ai";
import { IoStopwatchOutline } from "react-icons/io5";
import classes from "../../styles/button/buttons.module.css";
import { useNotification } from "../../hook/useNotification";
import usePYModels from "../../hook/usePYModels";

let interval;

const Buttons = ({ chartDataState, setChartDataState, setPythonURLImage }) => {
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
    const globalTimeInMilliseconds = new Date().getTime();
    var lastNegativeAngle = false;
    try {
      interval = setInterval(async () => {
        console.log(lastNegativeAngle);
        try {
          const response = await window.webSerialApi.readSerialPort();
          console.log(response.message);
          if (response.message !== undefined) {
            const message = response.message;
            console.log(message);
            const values = message.split(",");
            console.log(values);
            var validAngles = [];
            var angleObjects = [];
            values.map((value, index) => {
              const floatValue = parseFloat(value);
              if (!isNaN(floatValue) && floatValue >= -90 && floatValue <= 90) {
                const decimalCount = value.split(".")[1]
                  ? value.split(".")[1].length
                  : 0;
                console.log(floatValue, decimalCount);
                if (decimalCount === 2) {
                  validAngles.push(floatValue);
                  const currentTimeInMilliseconds = new Date().getTime();
                  const currentTimestamp =
                    currentTimeInMilliseconds - globalTimeInMilliseconds;
                  if (
                    angleObjects.length > 0 &&
                    chartDataState.length > 0 &&
                    angleObjects[angleObjects.length - 1].angle != floatValue &&
                    chartDataState[chartDataState.length - 1].angle !=
                      floatValue
                  ) {
                    angleObjects.push({
                      angle: floatValue,
                      timeInMillisec: currentTimestamp,
                    });
                  }
                  if (angleObjects.length == 0) {
                    angleObjects.push({
                      angle: lastNegativeAngle ? -1 * floatValue : floatValue,
                      timeInMillisec: currentTimestamp,
                    });
                  }
                }
              }
            });
            if (validAngles.length >= 1)
              lastNegativeAngle = validAngles[validAngles.length - 1] < 0;
            setReadCharacter(response.message);
            console.log(angleObjects);
            setChartDataState((prev) => [...prev, ...angleObjects]);
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
