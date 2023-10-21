import classes from "../../styles/Explorer.module.css";
import Head from "next/head";
import Header from "../../component/Header";

const Explorer = () => {
  return (
    <div className={classes.container}>
      <Head>
        <title>Explorer</title>
      </Head>
      <div className={classes.box}>
        <Header href={"/home"} page={"Explorer"} />
      </div>
    </div>
  );
};

export default Explorer;
