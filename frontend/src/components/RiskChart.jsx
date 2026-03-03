import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function RiskChart({ trend }) {
  const labels = trend.map((b) =>
    new Date(b.timestamp).toLocaleTimeString()
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Risk',
        data: trend.map((b) => b.avgRisk),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Risk Score Trend</h2>
      </div>
      <div className="chart-wrapper">
        {trend.length === 0 ? (
          <div className="empty-state">Waiting for enough data…</div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default RiskChart;

