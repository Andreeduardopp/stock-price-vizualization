import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const fetchStockData = async (ticker: string, startDate: string, endDate: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stocks`, {
      params: { ticker, start_date: startDate, end_date: endDate },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: "Stock data not found!" }; 
  }
};
