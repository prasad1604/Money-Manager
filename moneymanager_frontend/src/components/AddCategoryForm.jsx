import { LoaderCircle } from "lucide-react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { useEffect, useState } from "react";

const AddCategoryForm = ({onAddCategory,initialCategoryData,isEditing}) => {
  const [category, setCategory] = useState({
    name: "",
    type: "income",
    icon: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(isEditing && initialCategoryData){
      setCategory(initialCategoryData);
    }
    else{
      setCategory({name:"",type:"incomr",icon:""});
    }
   },[isEditing,initialCategoryData])

  const categoryTypeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" }
  ];

  const handleChange = (key, value) => {
    setCategory({ ...category, [key]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try{
      await onAddCategory(category)
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <EmojiPickerPopup
        icon={category.icon}
        onSelect={(icon) => handleChange("icon", icon)}
      />

      <Input
        value={category.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Category Name"
        placeHolder="eg:- Freelance, Salary, Groceries"
        type="text"
      />

      <Input
        label="Category Type"
        value={category.type}
        onChange={({ target }) => handleChange("type", target.value)}
        isSelect={true}
        options={categoryTypeOptions}
      />

      <div className="flex justify-end mt-6">
        <button 
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded-lg transition">
          {loading ? (
            <>
            <LoaderCircle className="w-4 h-4 animate-spin" />
            {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
            {isEditing ? "Update Category" : "Add Category"}
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default AddCategoryForm;
