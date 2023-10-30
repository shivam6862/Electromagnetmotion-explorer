import React from "react";
import Link from "next/link";
import classes from "../../styles/explorer/footer.module.css";
import { AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = ({ rotate }) => {
  const URL = [
    "https://www.linkedin.com/",
    "https://www.instagram.com/",
    "https://twitter.com/",
    "https://www.facebook.com/",
  ];
  const LOGOS = [
    <AiOutlineLinkedin />,
    <AiOutlineInstagram />,
    <FaSquareXTwitter />,
    <FaFacebook />,
  ];
  const contact_arr = ["linkedin", "instagram", "twitter", "facebook"];

  return (
    <div className={classes.container} id="contact">
      <div className={classes.box}>
        <div className={classes.bottom_footer}>
          <div className={classes.bottom_footer_left}>
            <p>Build Connection</p>
            <Link href={"/home"}>Start work</Link>
          </div>
          <div className={classes.bottom_footer_right}>
            <div
              className={classes.bottom_footer_right_box}
              style={
                rotate == 1
                  ? { flexDirection: "column" }
                  : { flexDirection: "row" }
              }
            >
              {contact_arr.map((item, index) => (
                <div
                  key={index}
                  onClick={async () => {
                    await window.openLinkInWeb.openLinkInWebPage(URL[index]);
                  }}
                >
                  {LOGOS[index]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
