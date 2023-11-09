import Head from "next/head";
import Image from "next/image";
import React, { useState, useContext } from "react";
import classes from "../../styles/Home.module.css";
import Header from "../../component/Header";
import LineChart from "../../component/chart/LineChart";
import Buttons from "../../component/button/Buttons";
import ArduinoContext from "../../store/arduino/arduino-context";
import { PiPlugsConnectedBold } from "react-icons/pi";

const Home = () => {
  const arduinoCtx = useContext(ArduinoContext);
  const [chartDataState, setChartDataState] = useState([]);
  const [pythonURLImage, setPythonURLImage] = useState(["/bg-amazing.webp"]);

  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/logo.jpg" />
        <title>Home</title>
        <meta name="Home" content="Home" />
      </Head>
      <Header href={"explorer"} page={"Home"} />
      <div className={classes.box}>
        <div className={classes.about_connection}>
          <PiPlugsConnectedBold />
          {"   "} Web Serial API :- {arduinoCtx.webSerialAPI.port}
        </div>
        <Buttons
          chartDataState={chartDataState}
          setChartDataState={setChartDataState}
          setPythonURLImage={setPythonURLImage}
        />
        <div className={classes.line_chart}>
          <LineChart chartDataState={chartDataState} />
          <LineChart chartDataState={chartDataState} />
        </div>
        <div className={classes.images_from_ml}>
          {pythonURLImage.map((item, index) => (
            <div className={classes.image_from_ml} key={index}>
              <Image src={item} width={500} height={400} alt="i" key={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
