"use client";
import React, { useEffect, useState, useContext } from "react";
import classes from "../../styles/Notification.module.css";
import NotificationContext from "../../store/notification/Notification-context";
import { RxCross1 } from "react-icons/rx";

const Notification = (props) => {
  const notifictionCtx = useContext(NotificationContext);
  const [width, setWidth] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const deleteNotification = (id) => {
    notifictionCtx.onDelete(id);
  };
  const handleStartTimer = () => {
    const id = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev + 0.5;
        }
        clearInterval(id);
        return prev;
      });
    }, 20);
    setIntervalId(id);
  };
  const handlePauseTimer = () => {
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (width === 100) {
      handlePauseTimer();
      setTimeout(() => {
        notifictionCtx.onDelete(props.id);
      }, 300);
    }
  }, [width]);
  useEffect(() => {
    handleStartTimer();
  }, []);

  return (
    <div
      onMouseEnter={handlePauseTimer}
      onMouseLeave={handleStartTimer}
      key={props.id}
      className={`${classes.notification}`}
      style={{ background: props.type }}
    >
      <div className={classes.box}>
        <div className={classes.logo}>{props.logo}</div>
        <div className={classes.content}>
          <h1>{props.title}</h1>
          <p>{props.message}</p>
        </div>
        <div className={classes.buttons}>
          <button onClick={() => deleteNotification(props.id)}>
            <RxCross1 />
          </button>
        </div>
      </div>
      <div
        className={`${classes.lowerProgressbar}`}
        style={{ width: width + "%" }}
      ></div>
    </div>
  );
};
export default Notification;
