"use client";
import React, { useState } from "react";
import classes from "../../styles/explorer/faq.module.css";
import { IoIosArrowForward } from "react-icons/io";

const FAQS = ({ heading, QUESTIONS }) => {
  const [currentOpen, setCurrentOpen] = useState(-1);
  const handleChange = (index) => {
    if (currentOpen == index) setCurrentOpen(-1);
    else setCurrentOpen(index);
  };

  return (
    <div className={classes.container}>
      <h1>{heading}</h1>
      <div className={classes.box}>
        <div className={classes.items}>
          {QUESTIONS.map((item, index) => {
            const questionContainerStyle = {
              paddingBottom: index === currentOpen ? "5rem" : "0rem",
            };
            return (
              <div className={classes.item} key={index}>
                <div className={classes.question_container}>
                  <div className={classes.left}>
                    <div
                      className={classes.indexs}
                      style={questionContainerStyle}
                    >
                      {index < 9 ? "0" : ""}
                      {index + 1}
                    </div>
                    <div
                      className={classes.question}
                      style={questionContainerStyle}
                    >
                      {item.question}
                    </div>
                  </div>
                  <div
                    className={`${classes.down_arrow} ${
                      index === currentOpen ? classes.rotate_button : ""
                    }`}
                    style={questionContainerStyle}
                    onClick={() => {
                      handleChange(index);
                    }}
                  >
                    <IoIosArrowForward />
                  </div>
                </div>
                {index === currentOpen && (
                  <div className={classes.answer}>{item.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQS;
