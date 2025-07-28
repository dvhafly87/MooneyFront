import Chart from 'react-apexcharts';

export const Apexcharts = ({ win, defeat }) => {
  let series = [];
  let labels = [];
  let colors = [];

  if (win === 0 && defeat === 0) {
    series = [1];
    labels = ['데이터 없음'];
    colors = ['#ccc'];
  } else if (win === 0) {
    series = [defeat];
    labels = ['지출'];
    colors = ['#FF4D4D'];
  } else if (defeat === 0) {
    series = [win];
    labels = ['수입'];
    colors = ['#3C82F6'];
  } else {
    series = [win, defeat];
    labels = ['수입', '지출'];
    colors = ['#3C82F6', '#FF4D4D'];
  }

  const options = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    labels,
    colors,
    legend: { show: false },
    dataLabels: { enabled: false },
  };

  return <Chart options={options} series={series} type="donut" width={150} />;
};
