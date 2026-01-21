import { addThousandsSeparator } from "../util/util";
import CustomPieChart from "./CustomPieChart";

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const COLORS = ["#59168B", "#a0090e", "#016630"];

    const balanceData = [
        {name: "TotalBalance", amount: totalBalance},
        {name: "TotalExpense", amount: totalExpense},
        {name: "TotalIncome", amount: totalIncome},
    ]
    console.log("Pie data:", balanceData);
    return (
        <div className="card h-[360px] shadow-lg">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>
            <CustomPieChart 
            data={balanceData}
            label= "Total Balance"
            totalAmount={`₹${addThousandsSeparator(totalBalance)}`}
            colors={COLORS}
            showTextAnchor
            />
        </div>
    )
}

export default FinanceOverview;