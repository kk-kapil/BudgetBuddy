import { useState, useContext, useRef } from "react";
import Model from "@/components/Model"; // Ensure this path is correct
import { budgetContext } from "@/lib/store/budgetContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

export default function AddExpensesModal({ show, onClose }) {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showAddExpenses , setShowAddExpenses] = useState(false);
  const { expenses, addExpenseItem , addCategory } = useContext(budgetContext);
  
  const titleRef = useRef();
  const colorRef = useRef();
  const AddExpenseItemHandler = async () => {
    const expense = expenses.find((e) => {
      return e.id == selectedCategory;
    });
    const newExpenses = {
      color: expense.color,
      title: expense.title,
      total: expense.total + +expenseAmount,
      items: [
        ...expense.items,
        {
          amount: +expenseAmount,
          createdAt: new Date(),
          id: uuidv4(),
        },
      ],
    };
    try {
      await addExpenseItem(selectedCategory, newExpenses);
      console.log(newExpenses);
      setExpenseAmount("");
      setSelectedCategory(null);
      toast.success("Expense item added successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const addCategoryHandler= async() =>{
    const title = titleRef.current.value
    const color = colorRef.current.value
    try {
        await addCategory({title , color , total :0})
        setShowAddExpenses(false);
        toast.success("New expense category added successfully");
    } catch (error) {
        toast.error(error.message);
        console.log(error.message);

    }
  }

  return (
    <Model show={show} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <label>Enter an amount</label>
        <input
          type="number"
          min={0.01}
          step={0.01}
          placeholder="Enter expense amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="px-4 py-2 bg-slate-600 rounded-xl" // Add a class for styling
        />
        {/* expenses category */}
        {expenseAmount > 0 && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl capitalize">Select Expense Category</h3>
              <button onClick={()=>{setShowAddExpenses(true)}} className="text-lime-400">+ New Category</button>
            </div>

            {showAddExpenses && (
                <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Enter Title"
                  ref={titleRef}
                  className="px-4 py-2 bg-slate-600 rounded-xl"
                />
  
                <label>Pick Color</label>
                <input
                  type="color"
                  className="w-24 h-10 px-4 py-2 bg-slate-600 rounded-xl"
                  ref={colorRef}
                />
                <button onClick={addCategoryHandler} className="btn btn-primary-outline">Create</button>

                <button onClick={()=>{
                    setShowAddExpenses(false);
                }} className="btn btn-danger">Cancel</button>
              </div>
            )}
            {expenses.map((expense) => (
              <button
                key={expense.id}
                onClick={() => setSelectedCategory(expense.id)}
              >
                <div
                  style={{
                    boxShadow:
                      expense.id == selectedCategory ? "1px 1px 4px" : "none",
                  }}
                  className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[25px] h-[25px] rounded-full"
                      style={{ backgroundColor: expense.color }}
                    />
                    <h4>{expense.title}</h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {expenseAmount > 0 && selectedCategory && (
        <div className="mt-6">
          <button className="btn btn-primary" onClick={AddExpenseItemHandler}>
            Add expense
          </button>
        </div>
      )}
    </Model>
  );
}
