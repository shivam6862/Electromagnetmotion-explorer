import React from "react";
import styles from "../../styles/explorer/setUp.module.css";
import { BsUsbDriveFill } from "react-icons/bs";
import Link from "next/link";

const SetUp = ({ heading, paragraph, link }) => {
  return (
    <div className={styles.container}>
      <h1>{heading}</h1>
      <p>{paragraph}</p>
      <div className={styles["links-container"]}>
        <Link href={link}>Get Started</Link>
        <div className={styles.play}>
          <BsUsbDriveFill />
          Connect USB
        </div>
      </div>
    </div>
  );
};

export default SetUp;
