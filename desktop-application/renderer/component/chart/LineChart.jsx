import React from "react";
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

const LineChart = ({ chartDataState }) => {
  const data = {
    labels: chartDataState.map((data) => data.timeInMillisec.toString()),
    datasets: [
      {
        label: "Angle",
        data: chartDataState.map((data) => data.angle.toString()),
        borderColor: "#ff7100",
        backgroundColor: "rgb(255, 113, 0, 0.3)",
        borderWidth: 1.1,
        pointRadius: 1,
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
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        min: 1,
        max: 16000,
        grid: {
          color: "#ff7100",
        },
        title: {
          display: true,
          text: "Time In Millisec",
        },
      },
      y: {
        type: "linear",
        min: -60,
        max: 60,
        grid: {
          color: "#ff7100",
        },
        title: {
          display: true,
          text: "Angle in degrees",
        },
      },
    },
  };

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1A1C22",
        borderRadius: "20px",
        padding: "0.5rem",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
