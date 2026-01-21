import { Download, LoaderCircle, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";
import { useState } from "react";

const IncomeList = ({ transactions , onDelete , onDownload, onEmail }) => {
  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    setLoading(true);
    try{
      await onEmail();
    }
    finally{
      setLoading(false);
    }
  }
  const handleDownload = async () => {
    setLoading(true); 
    try{
      await onDownload();
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm px-5 py-4">
      <div className="flex items-center justify-between">
        
        {/* Left title */}
        <h5 className="text-lg font-semibold text-gray-800">
          Income Sources
        </h5>

        {/* Right buttons */}
        <div className="flex items-center gap-2">
          <button 
          disabled={loading}
          onClick={handleEmail}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-purple-400 transition">
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Emailing...
              </>
            ) : (
              <>
              <Mail size={16} className="text-base" /> 
              Email
              </>
            )}
          </button>

          <button
          disabled={loading}
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-purple-400 transition">
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
              <Download size={16} className="text-base" />
              Download
              </>
            )}
          </button>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Display the incomes */}
            {transactions?.map((income) => (
                <TransactionInfoCard
                key={income.id} 
                title={income.name}
                icon={income.icon}
                date={moment(income.date).format('Do MM YYYY')}
                amount={income.amount}
                type="income"
                onDelete={() => onDelete(income.id)}
                />
            ))}
        </div>

    </div>
  );
};

export default IncomeList;
