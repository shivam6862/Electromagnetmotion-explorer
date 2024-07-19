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
  const [previousAllChartData, setPreviousAllChartData] = useState([]);
  const [pythonURLImage, setPythonURLImage] = useState([
    "actual_vs_predicted_2023-11-10-11-17-33.png",
    "mean_squared_error_random_forest2023-11-10-09-26-11.png",
    "mean_squared_error_random_forest2023-11-10-11-17-33.png",
  ]);

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
          setPreviousAllChartData={setPreviousAllChartData}
        />
        <div className={classes.line_chart}>
          <LineChart chartDataState={chartDataState} />
          {previousAllChartData.map((item, index) => (
            <LineChart chartDataState={item} key={index} />
          ))}
        </div>
        <div className={classes.images_from_ml}>
          {pythonURLImage.map((item, index) => (
            <div className={classes.image_from_ml} key={index}>
              <Image
                src={`http://localhost:8501/uploads/${item}`}
                width={500}
                height={400}
                alt={item}
                key={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
