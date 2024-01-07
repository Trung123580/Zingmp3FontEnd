import { useContext, useEffect, useRef, useState } from 'react';
import { isEqual as _isEqual } from 'lodash';
import { Line } from 'react-chartjs-2';
import { ChartCard } from '..';
import { AuthProvider } from '~/AuthProvider';
// eslint-disable-next-line no-unused-vars
import { Chart } from 'chart.js/auto';
const LineChart = ({ chartData }) => {
  const [chart, setChart] = useState(null);
  const [tooltipState, setTooltipState] = useState({
    opacity: 0,
    top: 0,
    left: 0,
  });
  const { selectedChart, handle } = useContext(AuthProvider);
  const { onChartHoverTooltip } = handle;
  const chartRef = useRef();
  const options = {
    responsive: true,
    pointRadius: 0,
    aspectRatio: 4,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { display: false },
        grid: { drawTicks: false, color: 'rgba(255,255,255,.2)' },
        min: chartData?.chart?.minScore,
        max: chartData?.chart?.maxScore,
        border: { dash: [3, 4] },
        color: 'transparent',
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'transparent' },
      },
    },
    layout: {
      border: false,
      padding: 10,
    },
    plugins: {
      legend: false,
      padding: 20,
      tooltip: {
        padding: 10,
        enabled: false,
        external: ({ tooltip }) => {
          if (!chartRef || !chartRef.current) return;
          if (tooltip.opacity === 0) {
            if (tooltipState.opacity !== 0) setTooltipState((prev) => ({ ...prev, opacity: 0 }));
            return;
          }
          const counters = [];
          for (let i = 0; i < 3; i++) {
            counters.push({
              data: chartData?.chart?.items[Object.keys(chartData?.chart?.items)[i]]
                ?.filter(({ hour }) => hour % 2 !== 0)
                ?.map(({ counter }) => counter),
              encodeId: Object.keys(chartData?.chart?.items)[i],
              backgroundChart: i === 0 ? '#4a90e2' : i === 1 ? '#50e3c2' : '#e35050',
            });
          }
          const results = counters.find(({ data }) => data.some((item) => item === Number(tooltip.body[0]?.lines[0]?.replace(',', ''))));
          const { encodeId, backgroundChart } = results;
          onChartHoverTooltip({ encodeId, backgroundChart });
          const newTooltipData = {
            opacity: 1,
            left: tooltip.caretX,
            top: tooltip.caretY,
          };
          if (!_isEqual(tooltipState, newTooltipData)) setTooltipState(newTooltipData);
        },
      },
    },
    hover: {
      mode: 'dataset',
      intersect: false,
    },
  };

  useEffect(() => {
    const labels = chartData?.chart?.times?.filter(({ hour }) => hour % 2 !== 0)?.map(({ hour }) => `${hour}:00`) || [];
    const datasets = [];
    if (chartData?.chart?.items) {
      for (let i = 0; i < 3; i++) {
        const itemKey = Object.keys(chartData?.chart?.items)[i];
        const itemData = chartData?.chart?.items[itemKey];
        if (itemData) {
          const data = itemData.filter(({ hour }) => hour % 2 !== 0)?.map(({ counter }) => counter);
          datasets.push({
            data,
            borderColor: i === 0 ? '#4a90e2' : i === 1 ? '#50e3c2' : '#e35050',
            tension: 0.2,
            borderWidth: 2,
            pointHoverRadius: 6,
            pointBackgroundColor: i === 0 ? '#4a90e2' : i === 1 ? '#50e3c2' : '#e35050',
            pointBorderColor: 'white',
            pointHoverBorderWidth: 3,
            // pointRotation: 4,
          });
        }
      }
    }

    setChart({ labels, datasets });
  }, [chartData]);
  const hoverChart = chartData?.items?.find(({ encodeId }) => encodeId === selectedChart?.encodeId);
  return (
    <>
      {!!chart && <Line data={chart} ref={chartRef} options={options} />}
      <div
        className='tooltip'
        style={{
          transform: 'translateY(10%) translateX(-30%)',
          top: tooltipState.top,
          left: tooltipState.left,
          opacity: tooltipState.opacity,
          position: 'absolute',
          zIndex: '100',
        }}>
        {!!hoverChart && (
          <ChartCard
            style={{ width: 'max-content', background: selectedChart?.backgroundChart, padding: '7px' }}
            data={hoverChart}
            totalScore={chartData?.chart?.totalScore}
          />
        )}
      </div>
    </>
  );
};

export default LineChart;
