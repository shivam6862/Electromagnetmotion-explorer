"use client";
import React from "react";
import { useState, useEffect } from "react";

const ArduinoContext = React.createContext({
  webSerialAPI: { port: "Not connected", status: "Error" },
  onaddWebSerialAPI: (value) => {},
  isDark: false,
  onDarkMode: (value) => {},
});

export const ArduinoContextProvider = (props) => {
  const [webSerialAPI, setwebSerialAPI] = useState({
    port: "Not connected",
    status: "Error",
  });
  const [isDark, setIsDark] = useState(false);

  const onaddWebSerialAPIHandler = (value, status) => {
    console.log(value, status);
    setwebSerialAPI({ port: value, status: status });
  };
  const onDarkModeHandler = (value) => {
    setIsDark(value);
  };

  useEffect(() => {
    const deafultTheme = async () => {
      const response = await window.darkMode.system();
      setIsDark(response);
    };
    deafultTheme();
  }, []);

  return (
    <ArduinoContext.Provider
      value={{
        webSerialAPI: webSerialAPI,
        onaddWebSerialAPI: onaddWebSerialAPIHandler,
        isDark: isDark,
        onDarkMode: onDarkModeHandler,
      }}
    >
      {props.children}
    </ArduinoContext.Provider>
  );
};

export default ArduinoContext;
