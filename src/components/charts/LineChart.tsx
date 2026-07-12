"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: any;
  title?: string;
}

export default function LineChart({ data, title }: LineChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#A0A0B8",
          font: { family: "Inter", size: 12 },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: "#F0F0F5",
        font: { family: "Inter", size: 16, weight: "bold" as const },
      },
      tooltip: {
        backgroundColor: "#1A1A2E",
        titleColor: "#F0F0F5",
        bodyColor: "#A0A0B8",
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#A0A0B8", font: { family: "Inter", size: 12 } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#A0A0B8", font: { family: "Inter", size: 12 } },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line options={options} data={data} />
    </div>
  );
}
