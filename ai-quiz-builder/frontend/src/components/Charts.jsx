import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

const baseFont = { family: 'Inter', size: 11 };

/** Bar chart — average score per quiz (teacher analytics). */
export const QuizPerformanceChart = ({ data = [] }) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => (d.title.length > 14 ? `${d.title.slice(0, 14)}…` : d.title)),
      datasets: [
        {
          label: 'Average score (%)',
          data: data.map((d) => d.averagePercentage),
          backgroundColor: '#3B4CCA',
          borderRadius: 6,
          maxBarThickness: 36,
        },
      ],
    }),
    [data]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { font: baseFont }, grid: { color: 'rgba(20,22,31,0.06)' } },
      x: { ticks: { font: baseFont }, grid: { display: false } },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

/** Line chart — a student's percentage over time (student analytics). */
export const PerformanceHistoryChart = ({ data = [] }) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => new Date(d.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Score (%)',
          data: data.map((d) => d.percentage),
          borderColor: '#E3B341',
          backgroundColor: 'rgba(227,179,65,0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#E3B341',
          pointRadius: 4,
        },
      ],
    }),
    [data]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { font: baseFont }, grid: { color: 'rgba(20,22,31,0.06)' } },
      x: { ticks: { font: baseFont }, grid: { display: false } },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};
