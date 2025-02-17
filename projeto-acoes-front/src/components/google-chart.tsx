"use client";
import { Chart } from "react-google-charts";

interface GoogleChartProps {
  stockData: { date: string; price: number }[];
}

export default function GoogleChart({ stockData }: GoogleChartProps) {
  if (!stockData.length) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  const chartData = [
    ["Date", "Price"], 
    ...stockData.map((item) => [item.date, item.price]),
  ];

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="700px"
      data={chartData}
      options={{
        title: "Stock Price History",
        curveType: "function",
        legend: { position: "bottom" },
        hAxis: { title: "Date" },
        vAxis: { title: "Price" },
      }}
    />
  );
}
