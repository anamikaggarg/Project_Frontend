import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PerformanceSummary = () => {
  const data = {
    labels: ["Completed", "Lagging", "On Track", "Ahead"],
    datasets: [
      {
        data: [60, 20, 20, 20],
        backgroundColor: ["#22c55e", "#fb923c", "#f43f5e", "#38bdf8"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "65%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    interaction: {
      mode: "nearest",
      intersect: true,
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-full h-full">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Performance Summary</h2>
        <span className="text-sm text-gray-500 cursor-pointer">
          View Details →
        </span>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative w-40 h-40">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-green-500">
            60%
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-5 rounded-xl w-full">
          <div>
            <p className="text-lg font-semibold">Proficient</p>
            <p className="text-gray-500 text-sm">Average Proficiency</p>
          </div>

          <div className="text-4xl">🏆</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 text-sm">
        <div>
          <p className="text-orange-500 font-semibold">Lagging</p>
          <p className="text-gray-500">20 Students / 20%</p>
        </div>

        <div>
          <p className="text-pink-500 font-semibold">On Track</p>
          <p className="text-gray-500">20 Students / 20%</p>
        </div>

        <div>
          <p className="text-green-500 font-semibold">Completed</p>
          <p className="text-gray-500">60 Students / 60%</p>
        </div>

        <div>
          <p className="text-blue-500 font-semibold">Ahead</p>
          <p className="text-gray-500">20 Students / 20%</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;
