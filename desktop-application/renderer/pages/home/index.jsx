import Head from "next/head";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import classes from "../../styles/Home.module.css";
import Header from "../../component/Header";
import LineChart from "../../component/chart/LineChart";
import Buttons from "../../component/button/Buttons";
import Button from "../../component/button/Button";
import { SiSpeedtest } from "react-icons/si";

const Home = () => {
  const [message, setMessage] = useState("Hii, Shivam kumar!");
  const [sendCharacter, setSendCharacter] = useState("");
  const [chartDataState, setChartDataState] = useState([]);

  useEffect(() => {
    window.ipc.on("message", (message) => {
      setMessage(message);
    });

    return () => {
      window.ipc.removeAllListeners("message");
    };
  }, []);

  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/logo.jpg" />
        <title>Home</title>
        <meta name="Home" content="Home" />
      </Head>
      <Header href={"explorer"} page={"Home"} />
      <div className={classes.box}>
        <div className={classes.input_area}>
          <input
            type="text"
            id="character"
            value={sendCharacter}
            onChange={(e) => {
              setSendCharacter(e.target.value);
            }}
          />
        </div>
        <Buttons
          sendCharacter={sendCharacter}
          chartDataState={chartDataState}
          setChartDataState={setChartDataState}
        />
        <div className={classes.line_chart}>
          <LineChart chartDataState={chartDataState} />
          <LineChart chartDataState={chartDataState} />
        </div>
        <div className={classes.images_from_ml}>
          <div className={classes.image_from_ml}>
            <Image src={"/bg-amazing.webp"} width={500} height={400} alt="i" />
          </div>
          <div className={classes.image_from_ml}>
            <Image src={"/bg-amazing.webp"} width={500} height={400} alt="i" />
          </div>
          <div className={classes.image_from_ml}>
            <Image src={"/bg-amazing.webp"} width={500} height={400} alt="i" />
          </div>
        </div>
        <Button
          heading={"Test IPC"}
          icon={<SiSpeedtest />}
          index={1}
          onClick={() => {
            window.ipc.send("message", "Electromagnetmotion ");
          }}
        />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Home;
