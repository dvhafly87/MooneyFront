import '@css/chartbar.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { category: '식비', amount: 100000 },
  { category: '교통', amount: 18000 },
  { category: '문화', amount: 12000 },
  { category: '기타', amount: 9000 },
];

const categoryColors = {
  식비: '#FF6384',
  교통: '#36A2EB',
  문화: '#FFCE56',
  기타: '#8BC34A',
};

function CategoryChart() {
  return (
    <div className="chart-bar">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis width={60} />
          <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categoryColors[entry.category]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export default CategoryChart;
