import classes from "../../styles/explorer/Explorer.module.css";
import Head from "next/head";
import Header from "../../component/Header";
import SetUp from "../../component/explorer/SetUp";
import PathToLearn from "../../component/explorer/PathToLearn";
import FAQS from "../../component/explorer/Faqs";
import Footer from "../../component/explorer/Footer";

const Explorer = () => {
  const QUESTIONS = [
    {
      question:
        "How do I connect an Arduino to display a simple pendulum's motion?",
      answer:
        " Attach a sensor to the pendulum, connect it to Arduino, and program it to read sensor data, calculate pendulum's angle, and display on an output device",
    },
    {
      question: "How can I calibrate the sensor for accurate readings?",
      answer:
        "Calibrate by recording sensor data when stationary (zero offset) and during known pendulum angles (scale factor), then use these values to adjust real-time sensor readings for accurate motion representation.",
    },
  ];

  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/logo.jpg" />
        <title>Explorer</title>
        <meta name="Explorer" content="Explorer" />
      </Head>
      <div className={classes.box}>
        <Header href={"home"} page={"Explorer"} />
        <SetUp heading="SetUp heading" paragraph="SetUp heading" link="/home" />
        <PathToLearn
          image={"/bg-amazing.webp"}
          heading="Path To Learn heading 1"
          about="Path To Learn About 1"
          paragraph="Path To Learn Paragraph 1"
        />
        <PathToLearn
          image={"/bg-amazing.webp"}
          heading="Path To Learn heading 2"
          about="Path To Learn About 2"
          paragraph="Path To Learn Paragraph 3"
        />
        <FAQS heading="" QUESTIONS={QUESTIONS} />
        <Footer rotate={0} />
      </div>
    </div>
  );
};

export default Explorer;
