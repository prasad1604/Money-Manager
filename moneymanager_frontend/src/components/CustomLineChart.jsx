import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-3 rounded-lg shadow-md border text-sm">
        <p className="font-semibold">{data.month}</p>
        <p className="text-purple-600 font-bold">
          Total: ₹{data.totalAmount.toLocaleString()}
        </p>

        <div className="mt-1 text-gray-600">
          <p className="font-medium">Details:</p>
          {data.items.map((item, i) => (
            <p key={i}>
              {item.source || "Income"}: ₹{Number(item.amount).toLocaleString()}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="totalAmount"
          stroke="none"
          fill="url(#incomeGradient)"
        />

        <Line
          type="monotone"
          dataKey="totalAmount"
          stroke="#7c3aed"
          strokeWidth={3}
          dot={{ r: 5, fill: "#7c3aed" }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
