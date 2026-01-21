import { PieChart, Pie, Cell, Tooltip } from "recharts";

const CustomPieChart = ({
  data = [],
  colors = [],
  label = "",
  totalAmount = "",
  showTextAnchor = false,
}) => {
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      {/* Chart */}
      <PieChart width={260} height={260}>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors.length ? colors[index % colors.length] : "#8884d8"}
            />
          ))}
        </Pie>

        <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
      </PieChart>

      {/* Center Text */}
      {showTextAnchor && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-semibold">{totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;
