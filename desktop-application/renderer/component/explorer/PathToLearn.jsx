import React from "react";
import classes from "../../styles/explorer/PathToLearn.module.css";
import Image from "next/image";
import { BsStars } from "react-icons/bs";

const PathToLearn = ({ image, heading, about, paragraph }) => {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <div className={classes.image}>
          <Image src={image} width={1700} height={500} alt="image" />
        </div>
      </div>
      <div className={classes.right}>
        <h4>
          <BsStars />
          {heading}
        </h4>
        <h1>{about}</h1>
        <p>{paragraph}</p>
      </div>
    </div>
  );
};

export default PathToLearn;
