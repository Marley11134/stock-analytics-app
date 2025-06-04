import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const API_KEY = '0YCDZvMMC74xuDUGgImTZOWr6LI1qnXU';

export default function Company() {
  const router = useRouter();
  const { ticker } = router.query;

  const [profile, setProfile] = useState(null);
  const [incomeStatements, setIncomeStatements] = useState([]);
  const [prices, setPrices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ticker) return;

    async function fetchData() {
      try {
        setError('');
        const profileRes = await fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${API_KEY}`);
        const profileData = await profileRes.json();
        setProfile(profileData[0]);

        const incomeRes = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=5&apikey=${API_KEY}`);
        const incomeData = await incomeRes.json();
        setIncomeStatements(incomeData);

        const priceRes = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line&timeseries=30&apikey=${API_KEY}`);
        const priceData = await priceRes.json();
        setPrices(priceData.historical.reverse());
      } catch (err) {
        setError("We couldn’t retrieve data for this company. Please check the ticker and try again.");
      }
    }

    fetchData();
  }, [ticker]);

  const chartData = {
    labels: incomeStatements.map(i => i.date),
    datasets: [
      {
        label: 'Revenue (B USD)',
        data: incomeStatements.map(i => i.revenue / 1e9),
        borderColor: '#58a6ff',
        backgroundColor: 'transparent',
        tension: 0.3
      },
      {
        label: 'Net Income (B USD)',
        data: incomeStatements.map(i => i.netIncome / 1e9),
        borderColor: '#2ea043',
        backgroundColor: 'transparent',
        tension: 0.3
      }
    ]
  };

  const priceChartData = {
    labels: prices.map(p => p.date),
    datasets: [
      {
        label: 'Close Price (USD)',
        data: prices.map(p => p.close),
        borderColor: '#f78166',
        backgroundColor: 'transparent',
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {profile && (
        <>
          <h1>{profile.companyName} ({profile.symbol})</h1>
          <p><strong>Industry:</strong> {profile.industry}</p>
          <p>{profile.description}</p>
          <p><strong>Exchange:</strong> {profile.exchangeShortName}</p>
          <p><a href={profile.website} target="_blank" rel="noreferrer">Visit Website</a></p>
        </>
      )}

      {incomeStatements.length > 0 && (
        <>
          <h2 style={{ marginTop: '2rem' }}>Income Chart (Last 5 Years)</h2>
          <Line data={chartData} />

          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #444', padding: '0.5rem' }}>Year</th>
                <th style={{ borderBottom: '1px solid #444', padding: '0.5rem' }}>Revenue</th>
                <th style={{ borderBottom: '1px solid #444', padding: '0.5rem' }}>Gross Profit</th>
                <th style={{ borderBottom: '1px solid #444', padding: '0.5rem' }}>Net Income</th>
              </tr>
            </thead>
            <tbody>
              {incomeStatements.map((s) => (
                <tr key={s.date}>
                  <td style={{ padding: '0.5rem' }}>{s.date}</td>
                  <td style={{ padding: '0.5rem' }}>${(s.revenue / 1e9).toFixed(2)}B</td>
                  <td style={{ padding: '0.5rem' }}>${(s.grossProfit / 1e9).toFixed(2)}B</td>
                  <td style={{ padding: '0.5rem' }}>${(s.netIncome / 1e9).toFixed(2)}B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {prices.length > 0 && (
        <>
          <h2 style={{ marginTop: '2rem' }}>Stock Price (Last 30 Days)</h2>
          <Line data={priceChartData} />
        </>
      )}
    </div>
  );
}
