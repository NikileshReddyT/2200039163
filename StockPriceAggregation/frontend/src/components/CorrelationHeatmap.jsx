import React from 'react';

function CorrelationHeatmap({ allPriceData, stocks }) {
  if (!Object.keys(allPriceData).length) return <p className="text-gray-500">Loading...</p>;

  const correlations = stocks.map(s1 => stocks.map(s2 => {
    const x = allPriceData[s1.ticker]?.map(p => p.price) || [];
    const y = allPriceData[s2.ticker]?.map(p => p.price) || [];
    if (!x.length || !y.length) return 0;
    const mx = x.reduce((s, v) => s + v, 0) / x.length;
    const my = y.reduce((s, v) => s + v, 0) / y.length;
    const num = x.reduce((s, v, k) => s + (v - mx) * (y[k] - my), 0, 0);
    const den = Math.sqrt(x.reduce((s, v) => s + (v - mx) ** 2, 0) * y.reduce((s, v) => s + (v - my) ** 2, 0));
    return den ? num / den : 0;
  }));

  return (
    <div>
      <h2 className="text-lg font-semibold">Correlation Heatmap</h2>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${stocks.length}, 40px)` }}>
        {correlations.map((row, i) => row.map((corr, j) => (
          <div
            key={`${i}-${j}`}
            className="w-10 h-10"
            style={{ backgroundColor: corr > 0 ? `rgba(0,255,0,${corr})` : `rgba(255,0,0,${-corr})` }}
            title={`${stocks[i].ticker} vs ${stocks[j].ticker}: ${corr.toFixed(2)}`}
          />
        )))}
      </div>
    </div>
  );
}

export default CorrelationHeatmap;