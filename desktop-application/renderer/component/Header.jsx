import React, { useContext } from "react";
import classes from "../styles/Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useTime } from "../hook/useTime";
import ArduinoContext from "../store/arduino/arduino-context";

const Header = ({ page }) => {
  const arduinoCtx = useContext(ArduinoContext);
  const { getCurrentDate, getCurrentDay } = useTime();

  const handleChangeTheme = async () => {
    const response = await window.darkMode.toggle();
    arduinoCtx.onDarkMode(response);
  };

  return (
    <div className={classes.header}>
      <div className={classes.header_left}>
        <div className={classes.header_left_first}>
          <Link href={"/explorer"}>
            <Image src="/logo.jpg" alt="Logo" width={150} height={150} />
          </Link>
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
        <div className={classes.day_night_mode}>
          {arduinoCtx.isDark ? (
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
