"use client";

interface SearchHistoryProps {
  history: { ticker: string; startDate: string; endDate: string }[];
  onSelect: (ticker: string, startDate: string, endDate: string) => void;
}

export default function SearchHistory({ history, onSelect }: SearchHistoryProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Search History</h3>
      <div className="flex flex-col gap-2">
        {history.length === 0 ? (
          <p className="text-gray-500">No recent searches.</p>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="p-3 border rounded-md cursor-pointer bg-white shadow-sm hover:shadow-md transition"
              onClick={() => onSelect(item.ticker, item.startDate, item.endDate)}
            >
              <p className="font-medium text-gray-700">{item.ticker}</p>
              <p className="text-sm text-gray-500">
                {item.startDate} → {item.endDate}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
