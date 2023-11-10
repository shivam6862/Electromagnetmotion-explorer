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
    {
      question:
        "What is the significance of mean squared error in machine learning models?",
      answer:
        "Mean squared error (MSE) quantifies the average squared difference between predicted and actual values. Lower MSE indicates a more accurate model, making it a vital metric for evaluating and improving machine learning algorithms.",
    },
    {
      question: "How does a linear regression model work in data analysis?",
      answer:
        "A linear regression model establishes a relationship between a dependent variable and one or more independent variables. It assumes a linear connection, enabling predictions based on input values. By fitting a line to the data points, it provides valuable insights into trends and helps make predictions.",
    },
    {
      question:
        "What role does damping play when a pendulum interacts with a metal plate?",
      answer:
        "Damping in a pendulum-metal plate interaction refers to the reduction of oscillations over time due to energy dissipation. The metal plate absorbs and dissipates the pendulum's energy, leading to a gradual decrease in amplitude. Understanding damping mechanisms is essential for analyzing the stability and behavior of pendulum systems in various environments.",
    },
    {
      question:
        "How can outliers affect the accuracy of a linear regression model?",
      answer:
        "Outliers, or extreme data points, can significantly impact the accuracy of a linear regression model. They can disproportionately influence the regression line, leading to skewed predictions. Identifying and handling outliers is crucial; techniques like data transformation or outlier removal can enhance the model's reliability and predictive power.",
    },
    {
      question:
        "In what ways can mean squared error be minimized to improve model accuracy?",
      answer:
        "Minimizing mean squared error involves fine-tuning model parameters, optimizing feature selection, and enhancing data quality. Techniques such as regularization, cross-validation, and proper scaling of features can help achieve a balance between bias and variance, leading to reduced MSE and more precise predictions.",
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
          image={"/graph.png"}
          heading="Path To Learn Arduino controller and damper"
          about="Creating a Chart of a Simple Pendulum's Motion"
          paragraph="An Arduino controller is used to measure and record the angle of a pendulum at specific time intervals. The Arduino device captures the angle and corresponding time data as the pendulum swings, possibly through sensors or other measuring mechanisms. This real-time data is then transmitted to a React application, where the received angle and time values are processed and plotted using the Chart.js library. The resulting line chart visually represents the pendulum's movement over time, providing a clear visualization of how the angle changes as the pendulum swings back and forth. This integration between hardware (Arduino) and software (React and Chart.js) allows for a seamless and interactive way to monitor and analyze the pendulum's behavior, enabling users to gain insights into its motion patterns and behavior."
        />
        <PathToLearn
          image={"/ml_graph.png"}
          heading="Path To Learn machine learning"
          about="Creating a mean squared error and a linear regression model"
          paragraph="Embarking on the exciting journey of mastering machine learning, understanding mean squared error (MSE) and delving into linear regression models are crucial steps. MSE, a pivotal metric, quantifies the accuracy of predictions by measuring the squared difference between predicted and actual values. This fundamental concept empowers learners to evaluate and refine their models effectively. Simultaneously, grasping the principles of linear regression provides the foundation for predicting numerical outcomes based on relationships between variables. These concepts serve as keystones in the educational odyssey, enabling enthusiasts to navigate the complexities of machine learning with confidence, creativity, and a deep understanding of predictive modeling."
        />
        <FAQS heading="" QUESTIONS={QUESTIONS} />
        <Footer rotate={0} />
      </div>
    </div>
  );
};

export default Explorer;
