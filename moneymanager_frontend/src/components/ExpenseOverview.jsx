import { useMemo } from "react";
import { prepareTransactionLineChartData } from "./prepareTransactionLineChartData";
import CustomLineChart from "./CustomLineChart";
import { Plus } from "lucide-react";

const ExpenseOverview = ({ transactions , onAddExpense }) => {

  const chartData = useMemo(() => {
    const result = prepareTransactionLineChartData(transactions);
    console.log(result);
    return result;
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Expense Overview</h5>
          <p className="text-xs text-gray-400 mt-0 5">
            Track your earnings over time and analyze your expense trends.
          </p>
        </div>
        <button
              onClick={onAddExpense}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition"
            >
              <Plus size={18} />
              <span>Add Expense</span>
            </button>
      </div>
      <div className="mt-10">
            <CustomLineChart data={chartData}/>
      </div>
    </div>
  );
};

export default ExpenseOverview;
