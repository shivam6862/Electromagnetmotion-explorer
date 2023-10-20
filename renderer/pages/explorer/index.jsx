import classes from "../../styles/Explorer.module.css";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

const Explorer = () => {
  return (
    <div className={classes.container}>
      <Head>
        <title>Explorer</title>
      </Head>
      <div className={classes.box}>
        <div className={classes.header}>
          <div className={classes.header_left}>
            <Image src="/logo.jpg" alt="Logo" width={150} height={150} />
            <h1>Explorer</h1>
          </div>
          <div className={classes.header_right}>
            <Link href={"/home"}>Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
