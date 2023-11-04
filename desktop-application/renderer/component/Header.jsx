import React, { useState, useEffect } from "react";
import classes from "../styles/Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useNotification } from "../hook/useNotification";
import { useTime } from "../hook/useTime";

const Header = ({ href, page }) => {
  const { NotificationHandler } = useNotification();
  const { getCurrentDate, getCurrentDay } = useTime();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    NotificationHandler("Thanks!", `Thank for joining us! **${page}**`, "Info");
    const deafultTheme = async () => {
      const response = await window.darkMode.system();
      setIsDark(response);
    };
    deafultTheme();
  }, []);

  const handleChangeTheme = async () => {
    const response = await window.darkMode.toggle();
    setIsDark(response);
  };

  return (
    <div className={classes.header}>
      <div className={classes.header_left}>
        <div className={classes.header_left_first}>
          <Image src="/logo.jpg" alt="Logo" width={150} height={150} />
          <div className={classes.header_left_first_text}>
            <span>Electromagnet</span>
            <span>Motion Explorer</span>
          </div>
        </div>
        <div className={classes.header_left_second}>
          <p>Welcome</p>
          <h1>{page}</h1>
        </div>
      </div>
      <div className={classes.header_right}>
        <div className={classes.date_time}>
          <p>{getCurrentDay()}</p>
          <h2>{getCurrentDate()}</h2>
        </div>
        <div className={classes.links}>
          <Link href={`/${href}`}>{href}</Link>
        </div>
        <div className={classes.day_night_mode}>
          {!isDark ? (
            <BsSunFill color="#fff" size={25} onClick={handleChangeTheme} />
          ) : (
            <BsMoonFill color="#fff" size={25} onClick={handleChangeTheme} />
          )}
        </div>
        <Image src="/bg-amazing.webp" alt="User" width={53} height={53} />
      </div>
    </div>
  );
};

export default Header;
