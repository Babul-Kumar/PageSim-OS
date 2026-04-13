import { useMemo } from 'react'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatPercent } from '../utils/helpers'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const BAR_COLORS = {
  FIFO: '#fb7185',
  LRU: '#2dd4bf',
  Optimal: '#60a5fa',
}
const CHART_LABELS = ['Page Faults', 'Page Hits', 'Hit Ratio (%)']

function ComparisonChart({ comparisonRows, isDarkMode, isReady }) {
  const data = useMemo(
    () => ({
      labels: CHART_LABELS,
      datasets: comparisonRows.map((row) => ({
        label: row.algorithm,
        data: [row.totalFaults, row.totalHits, Number(row.hitRatio.toFixed(2))],
        backgroundColor: BAR_COLORS[row.algorithm],
        borderRadius: 8,
      })),
    }),
    [comparisonRows],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 700,
        easing: 'easeOutCubic',
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      layout: {
        padding: {
          top: 8,
          right: 10,
        },
      },
      plugins: {
        legend: {
          labels: {
            color: isDarkMode ? '#d9f4eb' : '#0f4a3f',
            font: {
              weight: '600',
              size: 12,
            },
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const isRatio = context.label?.includes('Ratio')
              const value = context.raw
              return `${context.dataset.label}: ${isRatio ? formatPercent(Number(value)) : value}`
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 118, 110, 0.16)',
          },
          ticks: {
            color: isDarkMode ? '#c2eadd' : '#115e59',
            font: {
              size: 12,
            },
          },
        },
        y: {
          beginAtZero: true,
          grace: '12%',
          grid: {
            color: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 118, 110, 0.16)',
          },
          ticks: {
            color: isDarkMode ? '#c2eadd' : '#115e59',
            font: {
              size: 12,
            },
          },
        },
      },
    }),
    [isDarkMode],
  )

  return (
    <section className="surface-card overflow-hidden">
      <h2 className="mb-4 text-xl font-bold text-teal-950 dark:text-teal-50">
        Comparison Chart (FIFO vs LRU vs Optimal)
      </h2>

      {!isReady ? (
        <p className="text-sm text-teal-700 dark:text-teal-300">
          Complete the simulation to generate the final algorithm comparison.
        </p>
      ) : comparisonRows.length === 0 ? (
        <p className="text-sm text-teal-700 dark:text-teal-300">
          Run any simulation to generate an algorithm comparison chart.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="h-80 w-full">
            <Bar data={data} options={options} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="text-left text-teal-800 dark:text-teal-100">
                  <th className="pb-2">Algorithm</th>
                  <th className="pb-2">Faults</th>
                  <th className="pb-2">Hits</th>
                  <th className="pb-2">Hit Ratio</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.algorithm} className="border-t border-teal-100 dark:border-teal-900">
                    <td className="py-2 font-semibold">{row.algorithm}</td>
                    <td className="mono py-2">{row.totalFaults}</td>
                    <td className="mono py-2">{row.totalHits}</td>
                    <td className="mono py-2">{formatPercent(row.hitRatio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

export default ComparisonChart
