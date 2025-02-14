"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, subMonths, subYears } from "date-fns";

interface StockInputProps {
  onSearch: (ticker: string, startDate: string, endDate: string) => void;
}

export default function StockInput({ onSearch }: StockInputProps) {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(subMonths(new Date(), 1)); // Default: Last month
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [error] = useState("");
  const [preset, setPreset] = useState("1m"); // Default: Last month

  const handlePresetChange = (value: string) => {
    setPreset(value);

    const today = new Date();
    if (value === "1m") {
      setStartDate(subMonths(today, 1));
    } else if (value === "1y") {
      setStartDate(subYears(today, 1));
    } else if (value === "5y") {
      setStartDate(subYears(today, 5));
    } else {
      setStartDate(null); // Allow manual selection
    }
    setEndDate(today);
  };

  const handleSearch = () => {
    if (ticker.trim() && startDate && endDate) {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      onSearch(ticker.toUpperCase(), formattedStartDate, formattedEndDate);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stock Ticker Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 ">Stock Ticker:</label>
        <input
          type="text"
          placeholder="Enter Stock Ticker (e.g., AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border p-2 rounded-md w-full text-gray-700 "
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 font-medium">Select Date Range:</label>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-md text-gray-700  ${preset === "1m" ? "bg-blue-300 text-white" : "bg-gray-200"}`}
            onClick={() => handlePresetChange("1m")}
          >
            Last Month
          </button>
          <button
            className={`p-2 rounded-md text-gray-700 ${preset === "1y" ? "bg-blue-300 text-white" : "bg-gray-200"}`}
            onClick={() => handlePresetChange("1y")}
          >
            Last Year
          </button>
          <button
            className={`p-2 rounded-md text-gray-700 ${preset === "5y" ? "bg-blue-300 text-white" : "bg-gray-200"}`}
            onClick={() => handlePresetChange("5y")}
          >
            Last 5 Years
          </button>
          <button
            className={`p-2 rounded-md text-gray-700 ${preset === "custom" ? "bg-blue-300 text-white" : "bg-gray-200"}`}
            onClick={() => handlePresetChange("custom")}
          >
            Custom
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-700 font-medium">Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="border p-2 text-gray-700 rounded-md w-full border-gray-800"
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          disabled={preset !== "custom"}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 font-medium">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="border p-2 text-gray-700 rounded-md w-full border-gray-800"
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()} 
          disabled={preset !== "custom"}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white p-2 rounded-md disabled:opacity-50"
        disabled={!ticker.trim() || !startDate || !endDate}
      >
        Search
      </button>
    </div>
  );
}
