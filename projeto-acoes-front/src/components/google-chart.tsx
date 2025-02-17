"use client";
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";

interface GoogleChartProps {
  stockData: { date: string; price: number }[];
}

export default function GoogleChart({ stockData }: GoogleChartProps) {
  const [chartHeight, setChartHeight] = useState("700px");

  if (!stockData.length) {
    return <p className="text-center text-gray-500">No data available</p>;
  }
  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerWidth < 768 ? "400px" : "700px";
      setChartHeight((prevHeight) => (prevHeight !== newHeight ? newHeight : prevHeight));
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const firstPrice = stockData[0].price;
  const lastPrice = stockData[stockData.length - 1].price;
  const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
  const formattedChange = `Performance ${priceChange.toFixed(2)}%`;
  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const dotColor = isPositive ? "bg-green-600" : "bg-red-600";

  const chartData = [
    ["Date", "Price", { role: "annotation" }],
    ...stockData.map((item, index) => [
      item.date,
      item.price,
      index === stockData.length - 1 ? formattedChange : null,
    ]),
  ];

  return (
    <div className="relative overflow-auto touch-pan-y w-full max-w-[1200px] mx-auto">
      {/* ✅ Legenda fixa no canto superior direito */}
      <div className="absolute top-3 right-3 flex items-center bg-white p-2 rounded-md shadow-md">
        <span className={`w-3 h-3 rounded-full mr-2 ${dotColor}`} />
        <span className={`text-lg font-semibold ${changeColor}`}>
          {formattedChange}
        </span>
      </div>

      {/* ✅ Gráfico */}
      <Chart
        chartType="LineChart"
        width="100%"
        height={chartHeight}
        data={chartData}
        options={{
          title: "Stock Price History",
          curveType: "function",
          legend: { position: "bottom" },
          hAxis: { title: "Date" },
          vAxis: { title: "Price" },
          annotations: {
            textStyle: {
              fontSize: 18,
              color: isPositive ? "green" : "red",
            },
          },
          explorer: {
            actions: ["dragToZoom", "rightClickToReset"],
            axis: "horizontal",
            keepInBounds: true,
            maxZoomIn: 0.05,
          },
        }}
      />
    </div>
  );
}
