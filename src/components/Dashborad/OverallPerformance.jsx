import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const OverallPerformance = () => {
  const data = {
    labels: ["Advanced", "Intermediate", "Basic", "Proficient"],
    datasets: [
      {
        data: [50, 30, 10, 20],
        backgroundColor: [
          "#22c55e", // green
          "#ec4899", // pink
          "#f97316", // orange
          "#38bdf8", // blue
        ],
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
    },
  };

  const legendData = [
    { label: "Advanced", value: "50%", color: "#22c55e" },
    { label: "Intermediate", value: "30%", color: "#ec4899" },
    { label: "Basic", value: "10%", color: "#f97316" },
    { label: "Proficient", value: "20%", color: "#38bdf8" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">
          Overall Class Performance
        </h2>
        <span className="text-sm text-gray-500 cursor-pointer">
          View Details →
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Chart */}
        <div className="w-44 h-44">
          <Doughnut data={data} options={options} />
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {legendData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: item.color }}
              ></span>
              <div>
                <p className="font-semibold text-gray-800">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverallPerformance;