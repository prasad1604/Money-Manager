import { useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

const AddIncomeForm = ({ onAddIncome, categories }) => {
  const [income, setIncome] = useState({
    name: "",
    amount: "",
    date: "",
    icon: "",
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);

  const categoryOptions = categories.map((category) => ({
    value: String(category.id), // ✅ force string for select
    label: category.name,
  }));

  const handleChange = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddIncome = async () => {
    if (!income.categoryId) {
      alert("Please select category");
      return;
    }

    try {
      setLoading(true);

      await onAddIncome({
        ...income,
        categoryId: Number(income.categoryId),
        amount: Number(income.amount),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={
          (e) => handleChange("icon", e?.emoji || e) // ✅ store emoji string
        }
      />

      <Input
        value={income.name}
        onChange={(e) => handleChange("name", e.target.value)}
        label="Income Source"
        placeHolder="e.g. Salary, Freelance, Bonus"
        type="text"
      />

      <Input
        label="Category"
        value={income.categoryId}
        onChange={(e) => handleChange("categoryId", e.target.value)}
        isSelect={true}
        options={categoryOptions}
      />

      <Input
        value={income.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        label="Amount"
        placeHolder="eg. 500.00"
        type="number"
      />

      <Input
        value={income.date}
        onChange={(e) => handleChange("date", e.target.value)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          onClick={handleAddIncome}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded-lg transition"
        >
          {loading ? (
            <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Adding...
            </>
          ) : (
            <>
                Add Income
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
