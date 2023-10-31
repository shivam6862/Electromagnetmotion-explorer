"use client";
import React from "react";
import classes from "../../styles/button/button.module.css";

const Button = ({ heading, icon, dataShow, onClick, disabled }) => {
  return (
    <div className={classes.container} onClick={onClick}>
      <button disabled={disabled}>
        <div className={classes.icon}>{icon}</div>
        <div className={classes.details}>
          <p>{heading}</p>
          <h2>{dataShow}</h2>
        </div>
      </button>
    </div>
  );
};

export default Button;
