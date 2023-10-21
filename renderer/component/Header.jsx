import React, { useState, useEffect } from "react";
import classes from "../styles/Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useNotification } from "../hook/useNotification";

const Header = ({ href, page }) => {
  const { NotificationHandler } = useNotification();
  const [isdark, setIsDark] = useState(true);

  useEffect(() => {
    NotificationHandler(`Thank for joining us! **${page}**`, "Info");
    window.ipc.on("dark-mode:system", (response) => {
      setIsDark(response);
    });
    return () => {
      window.ipc.removeAllListeners("dark-mode:system");
    };
  }, []);

  const handleChangeTheme = async () => {
    const response = await window.darkMode.toggle();
    setIsDark(response);
  };
  return (
    <div className={classes.header}>
      <div className={classes.header_left}>
        <Image src="/logo.jpg" alt="Logo" width={150} height={150} />
        <h1>{page}</h1>
      </div>
      <div className={classes.header_right}>
        <div className={classes.links}>
          <Link href={`${href}`}>Explorer</Link>
        </div>
        <div className={classes.day_night_mode}>
          {isdark ? (
            <BsMoonFill color="#fff" size={25} onClick={handleChangeTheme} />
          ) : (
            <BsSunFill color="#fff" size={25} onClick={handleChangeTheme} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
