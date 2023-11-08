"use client";
import Image from "next/image";
import Link from "next/link";
import classes from "../styles/404.module.css";
import Header from "../component/Header";

const FourOhFour = () => {
  return (
    <>
      <Header />
      <div className={classes.container}>
        <Link href="/explorer">Go Back Explorer</Link>
        <div className={classes.image}>
          <Image src={"/error.jpg"} width={1500} height={1000} alt="error" />
        </div>
      </div>
    </>
  );
};

export default FourOhFour;
