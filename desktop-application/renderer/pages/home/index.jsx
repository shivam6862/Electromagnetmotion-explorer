import React, { useState, useEffect } from "react";
import classes from "../../styles/Home.module.css";
import Head from "next/head";
import Header from "../../component/Header";
import { useNotification } from "../../hook/useNotification";

const Home = () => {
  const { NotificationHandler } = useNotification();
  const [message, setMessage] = useState("Hii, Shivam kumar!");
  const [webSerialId, setWebSerialId] = useState("");
  const [readCharacter, setReadCharacter] = useState("");
  const [sendCharacter, setSendCharacter] = useState("");
  const [isReadButtonActive, setIsReadButtonActive] = useState(true);

  useEffect(() => {
    window.ipc.on("message", (message) => {
      setMessage(message);
    });

    return () => {
      window.ipc.removeAllListeners("message");
    };
  }, []);

  const handleConnectSerial = async () => {
    try {
      const response = await window.webSerialApi.requestSerialPort();
      if (response.type == "Success") setWebSerialId(response.message);
      else if (response.type == "Error")
        NotificationHandler(response.message, response.type);
    } catch (error) {
      NotificationHandler(error.message, "Warn");
    }
  };
  const handleSendCharacter = async () => {
    if (sendCharacter == "") {
      NotificationHandler("Please fill a character!", "Info");
      return;
    } else if (sendCharacter.length > 1) {
      NotificationHandler("Fill a single character!", "Warn");
      return;
    }
    try {
      const response = await window.webSerialApi.sendCharacterToSerialPort(
        sendCharacter
      );
      if (response.type == "Error")
        NotificationHandler(response.message, response.type);
    } catch (error) {
      NotificationHandler(error.message, "Warn");
    }
  };
  const handleReadCharacter = async () => {
    let interval;
    setIsReadButtonActive(false);
    try {
      interval = setInterval(async () => {
        try {
          const response = await window.webSerialApi.readSerialPort();
          if (response.message !== undefined) {
            setReadCharacter(response.message);
          }
        } catch (error) {
          NotificationHandler(error.message, "Error");
          clearInterval(interval);
          setIsReadButtonActive(true);
        }
      }, 2000);
    } catch (error) {
      NotificationHandler(error.message, "Info");
      setIsReadButtonActive(true);
    } finally {
      return () => {
        clearInterval(interval);
        setIsReadButtonActive(true);
      };
    }
  };
  const handleStartWork = async () => {
    try {
      const response = await window.workApi.sendCharacterToStartWork("S");
      console.log(response);
      if (response.type == "Error")
        NotificationHandler(response.message, response.type);
    } catch (error) {
      NotificationHandler(error.message, "Warn");
    }
  };
  const handleStopWork = async () => {
    try {
      const response = await window.workApi.sendCharacterToEndWork("C");
      console.log(response);
      if (response.type == "Error")
        NotificationHandler(response.message, response.type);
    } catch (error) {
      NotificationHandler(error.message, "Warn");
    }
  };

  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/logo.jpg" />
        <title>Home</title>
        <meta name="Home" content="Home" />
      </Head>
      <div className={classes.box}>
        <Header href={"/explorer"} page={"Home"} />
        <div className={classes.container_body}>
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
          <div className={classes.input_area}>
            <h2>Web Serial API</h2>
            <input
              type="text"
              id="character"
              value={sendCharacter}
              onChange={(e) => {
                setSendCharacter(e.target.value);
              }}
            />
            <div className={classes.buttons}>
              <button onClick={handleConnectSerial}>Web Serial API</button>
              <button onClick={handleSendCharacter}>Send character</button>
              <button onClick={handleStartWork}>Start work</button>
              <button onClick={handleStopWork}>Stop work</button>
              <button
                onClick={handleReadCharacter}
                disabled={!isReadButtonActive}
              >
                Read character
              </button>
            </div>
            <div className={classes.data_coming_from_web_serial}>
              <div>
                <p>
                  Web Serial API keys: <span>{webSerialId}</span>
                </p>
                <p>
                  Message received : <span>{readCharacter}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
