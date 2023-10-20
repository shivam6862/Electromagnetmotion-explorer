import React, { useState, useEffect } from "react";
import classes from "../../styles/Home.module.css";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

const Home = () => {
  const [message, setMessage] = useState("Hii, Shivam kumar!");

  useEffect(() => {
    window.ipc.on("message", (message) => {
      setMessage(message);
    });
  }, []);

  return (
    <div className={classes.container}>
      <Head>
        <title>Home</title>
      </Head>
      <div className={classes.box}>
        <div className={classes.header}>
          <div className={classes.header_left}>
            <Image src="/logo.jpg" alt="Logo" width={150} height={150} />
            <h1>Home</h1>
          </div>
          <div className={classes.header_right}>
            <Link href={"/explorer"}>Explorer</Link>
          </div>
        </div>
        <div className={classes.button_text}>
          <button
            onClick={() => {
              window.ipc.send("message", "Electromagnetmotion ");
            }}
          >
            Test IPC
          </button>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
