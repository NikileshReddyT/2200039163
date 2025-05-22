import React from 'react';

function StockSelector({ stocks, selectedStock, setSelectedStock }) {
  return (
    <select
      value={selectedStock}
      onChange={(e) => setSelectedStock(e.target.value)}
      className="border p-2 rounded mb-4"
    >
      {stocks.map(stock => (
        <option key={stock.ticker} value={stock.ticker}>{stock.company}</option>
      ))}
    </select>
  );
}

export default StockSelector;