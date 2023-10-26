import classes from "../../styles/Explorer.module.css";
import Head from "next/head";
import Header from "../../component/Header";
import LineChart from "../../component/chart/LineChart";

const Explorer = () => {
  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/logo.jpg" />
        <title>Explorer</title>
        <meta name="Explorer" content="Explorer" />
      </Head>
      <div className={classes.box}>
        <Header href={"/home"} page={"Explorer"} />
        <LineChart />
      </div>
    </div>
  );
};

export default Explorer;
