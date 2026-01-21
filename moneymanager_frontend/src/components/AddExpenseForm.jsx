import { useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories }) => {
  const [expense, setExpense] = useState({
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
    setExpense((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddExpense = async () => {
    if (!expense.categoryId) {
      alert("Please select category");
      return;
    }

    try {
      setLoading(true);

      await onAddExpense({
        ...expense,
        categoryId: Number(expense.categoryId),
        amount: Number(expense.amount),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={
          (e) => handleChange("icon", e?.emoji || e) // ✅ store emoji string
        }
      />

      <Input
        value={expense.name}
        onChange={(e) => handleChange("name", e.target.value)}
        label="Expense Source"
        placeHolder="e.g. Food, Rent, Travel"
        type="text"
      />

      <Input
        label="Category"
        value={expense.categoryId}
        onChange={(e) => handleChange("categoryId", e.target.value)}
        isSelect={true}
        options={categoryOptions}
      />

      <Input
        value={expense.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        label="Amount"
        placeHolder="eg. 500.00"
        type="number"
      />

      <Input
        value={expense.date}
        onChange={(e) => handleChange("date", e.target.value)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          onClick={handleAddExpense}
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
                Add Expense
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
