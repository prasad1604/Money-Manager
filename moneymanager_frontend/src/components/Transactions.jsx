import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const Transactions = ({transactions, onMore, type, title}) => {
  return (
    <div className="card shadow-lg">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">{title}</h5>
            <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md transition" onClick={onMore}>
                More <ArrowRight className="text-base" size={15} />
            </button>
        </div>

        <div className="mt-6">
            {transactions?.slice(0,5)?.map(item => (
                <TransactionInfoCard 
                key={item.id}
                title={item.name}
                icon={item.icon}
                date={moment(item.date).format("DD MMM YYYY")}
                amount={item.amount}
                type={type}
                hideDeleteBtn
                />
            ))}
        </div>
    </div>
  )
}

export default Transactions;