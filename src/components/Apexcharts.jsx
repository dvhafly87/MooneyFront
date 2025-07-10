import React from 'react';
import Chart from 'react-apexcharts';

export const Apexcharts = ({ win, defeat }) => {
  const series = [win, defeat];

  const options = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    labels: ['승리', '패배'],
    colors: ['#3C82F6', '#FF4D4D'],
    legend: { show: false },
    dataLabels: { enabled: false },
  };

  return <Chart options={options} series={series} type="donut" width={150} />;
};
