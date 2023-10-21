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
    if (sendCharacter == "") return;
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
    try {
      const interval = setInterval(async () => {
        try {
          const response = await window.webSerialApi.readSerialPort();
          if (response.message != undefined) setReadCharacter(response.message);
        } catch (error) {
          NotificationHandler(error.message, "Error");
        }
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    } catch (error) {
      NotificationHandler(error.message, "Info");
    }
  };

  return (
    <div className={classes.container}>
      <Head>
        <title>Home</title>
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
              <button onClick={handleConnectSerial}>Test Web Serial API</button>
              <button onClick={handleSendCharacter}>Send character</button>
              <button onClick={handleReadCharacter}>Read character</button>
            </div>
            <div className={classes.data_coming_from_web_serial}>
              <div>
                <p>
                  Web Serial API keys: <span>{webSerialId}</span>
                </p>
                <p>
                  Character read: <span>{readCharacter}</span>
                </p>
                <p>
                  Send character: <span>{sendCharacter}</span>
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
