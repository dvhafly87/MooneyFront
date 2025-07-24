import '../css/chartbar.css';
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

const categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#9C27B0', '#00ACC1'];

function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-bar">
        <p style={{ textAlign: 'center', marginTop: '100px', color: '#888' }}>데이터가 없습니다.</p>
      </div>
    );
  }

  const amounts = data.map((d) => d.amount);
  const max = Math.max(...amounts);
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const maxY = Math.ceil(((max + avg) * 1.1) / 10000) * 10000 || 10000;

  return (
    <div className="chart-bar">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          barSize={30}
          margin={{ top: 10, right: 20, left: 40, bottom: 10 }} // ✅ 여기!
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis width={60} domain={[0, maxY]} />
          <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
