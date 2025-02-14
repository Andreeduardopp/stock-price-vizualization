"use client";
import { useState } from "react";
import StockInput from "../components/stock-input";
import GoogleChart from "../components/google-chart";
import SearchHistory from "../components/search-history";
import { fetchStockData } from "../lib/api";

export default function Home() {
  const [stockData, setStockData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [history, setHistory] = useState<{ ticker: string; startDate: string; endDate: string }[]>([]);

  const handleSearch = async (ticker: string, startDate: string, endDate: string) => {
    setLoading(true);
    
    try {
      const data = await fetchStockData(ticker, startDate, endDate);

      if (!data || data?.error) {
        setErrorMessage(data?.error || "Stock data not found!");
        setShowSnackbar(true);
        setStockData([]);
      } else {
        setStockData(data?.data || []);
        setShowSnackbar(false);
        const newHistory = [{ ticker, startDate, endDate }, ...history].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem("searchHistory", JSON.stringify(newHistory));

      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("API request failed. Check your network and try again.");
      setShowSnackbar(true);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Stock Search</h2>
        <StockInput onSearch={handleSearch} />
        <SearchHistory history={history} onSelect={handleSearch} />
      </div>

      <div className="w-3/4 p-6 flex justify-center items-center">
        {loading ? <p>Loading...</p> : <GoogleChart stockData={stockData} />}
      </div>

      {showSnackbar && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500">
          {errorMessage}
        </div>
      )}
    </div>
  );
}