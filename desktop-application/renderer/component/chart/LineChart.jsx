import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale } from "chart.js";
import { PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import chartData from "./data.json";
var index = 0;

const LineChart = () => {
  const [chartDataState, setChartDataState] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (index == chartData.length) {
        clearInterval(intervalId);
        index = 0;
        return;
      }
      setChartDataState((prevChartData) => [
        ...prevChartData,
        chartData[index++],
      ]);
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const data = {
    labels: chartDataState.map((data) => data.timeInMillisec.toString()),
    datasets: [
      {
        label: "Angle",
        data: chartDataState.map((data) =>
          Math.sin((data.angle * Math.PI) / 180).toString()
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Frequency vs Time Graph",
      },
    },
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        type: "linear",
        min: 1,
        max: 1000,
        title: {
          display: true,
          text: "Time In Millisec",
        },
      },
      y: {
        type: "linear",
        min: -1.5,
        max: 1.5,
        title: {
          display: true,
          text: "Sin value (angle in degree)",
        },
      },
    },
  };

  return (
    <div
      style={{
        height: "80vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
