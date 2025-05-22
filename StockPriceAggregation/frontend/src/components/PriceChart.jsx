import React from 'react';

function PriceChart({ priceData }) {
  if (!priceData.length) return <p className="text-gray-500">Loading...</p>;

  const avgPrice = priceData.reduce((sum, p) => sum + p.price, 0) / priceData.length;

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">Price Chart (Last 10 Minutes)</h2>
      <div className="flex flex-col">
        {priceData.map((point, index) => (
          <div key={index} className="flex items-center">
            <span className="w-32">{new Date(point.lastUpdatedAt).toLocaleTimeString()}</span>
            <div className="h-6 bg-blue-500" style={{ width: `${point.price / 10}px` }}></div>
            <span className="ml-2">{point.price}</span>
          </div>
        ))}
        <div className="flex items-center mt-2">
          <span className="w-32">Average</span>
          <div className="h-6 bg-red-500" style={{ width: `${avgPrice / 10}px` }}></div>
          <span className="ml-2">{avgPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default PriceChart;