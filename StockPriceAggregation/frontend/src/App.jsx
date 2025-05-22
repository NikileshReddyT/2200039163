import React, { useState, useEffect } from 'react';
import StockSelector from './components/StockSelector';
import PriceChart from './components/PriceChart';
import CorrelationHeatmap from './components/CorrelationHeatmap';

function App() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3ODk1MzA2LCJpYXQiOjE3NDc4OTUwMDYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBiNjBjOGMzLTU1MzYtNGM1NC04OWMzLWFiNDBhODVhMWUyYSIsInN1YiI6IjIyMDAwMzkxNjNjc2VyQGdtYWlsLmNvbSJ9LCJlbWFpbCI6IjIyMDAwMzkxNjNjc2VyQGdtYWlsLmNvbSIsIm5hbWUiOiJuaWtpbGVzaCByZWRkeSB0Iiwicm9sbE5vIjoiMjIwMDAzOTE2MyIsImFjY2Vzc0NvZGUiOiJiZVRKakoiLCJjbGllbnRJRCI6IjBiNjBjOGMzLTU1MzYtNGM1NC04OWMzLWFiNDBhODVhMWUyYSIsImNsaWVudFNlY3JldCI6ImVEQXBHdHBjWnR1TXFKSEEifQ.QfyBNx1rwL3vMD5MnFbn64aolD58GxJDo3fLiTXTe0c";
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [priceData, setPriceData] = useState([]);
  const [allPriceData, setAllPriceData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/evaluation-service/stocks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json()) // Assuming the backend allows CORS
      .then(data => {
        if (data && data.stocks) {
          const stockList = Object.entries(data.stocks).map(([company, ticker]) => ({ company, ticker }));
          setStocks(stockList);
          setSelectedStock(stockList[0]?.ticker || '');
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(err => {
        setError('Error fetching stocks: ' + err.message);
        console.error('Fetch error:', err);
      });
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetch(`/evaluation-service/stocks/${selectedStock}?minutes=10`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json()) // Assuming the backend allows CORS
        .then(data => {
          if (data) setPriceData(data);
        })
        .catch(err => {
          setError('Error fetching stock price data: ' + err.message);
          console.error('Fetch error:', err);
        });
    }

    // Fetch all stock prices for correlation heatmap
    Promise.all(stocks.map(stock =>
      fetch(`/evaluation-service/stocks/${stock.ticker}?minutes=10`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json()) // Assuming the backend allows CORS
        .then(data => ({ [stock.ticker]: data }))
    ))
      .then(results => {
        const validResults = results.filter(r => r !== null);
        if (validResults.length === results.length) {
          setAllPriceData(Object.assign({}, ...validResults));
        }
      })
      .catch(err => {
        setError('Error fetching all stock data: ' + err.message);
        console.error('Fetch error:', err);
      });
  }, [selectedStock, stocks]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock Price Dashboard</h1>
      
      {/* Show error message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <StockSelector stocks={stocks} selectedStock={selectedStock} setSelectedStock={setSelectedStock} />
      <PriceChart priceData={priceData} />
      <CorrelationHeatmap allPriceData={allPriceData} stocks={stocks} />
    </div>
  );
}

export default App;
