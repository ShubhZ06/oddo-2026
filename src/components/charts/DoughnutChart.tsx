"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DoughnutChartProps {
  data: any;
  title?: string;
}

export default function DoughnutChart({ data, title }: DoughnutChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#A0A0B8",
          font: { family: "Inter", size: 12 },
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: "#F0F0F5",
        font: { family: "Inter", size: 16, weight: "bold" as const },
        padding: { bottom: 20 },
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
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Doughnut options={options} data={data} />
    </div>
  );
}
