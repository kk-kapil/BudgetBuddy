import { useState, useContext } from "react";
import { currencyFormatter } from "@/lib/utils";
import Model from "../Model";
import { budgetContext } from "@/lib/store/budgetContext";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

function ViewExpenseModel({ show, onClose, expense }) {
  const { deleteExpenseItem, deleteExpenseCategory } =
    useContext(budgetContext);

  const deleteExpenseHandler = async () => {
    try {
      await deleteExpenseCategory(expense.id);
      toast.success("Expense category deleted");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const [localExpense, setLocalExpense] = useState(expense);

  const deleteExpenseItemHandler = async (item) => {
    try {
      // remove the item from the list
      const updatedItems = localExpense.items.filter((i) => i.id !== item.id);

      // update the expense balance
      const updatedExpense = {
        ...localExpense,
        items: updatedItems,
        total: localExpense.total - item.amount,
      };

      await deleteExpenseItem(updatedExpense, expense.id);
      toast.success("Expense item deleted");
      setLocalExpense(updatedExpense);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  if (!localExpense) {
    return null;
  }

  return (
    <Model show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">{localExpense.title}</h2>
        <button onClick={deleteExpenseHandler} className="btn btn-danger">
          Delete
        </button>
      </div>
      <div>
        <h3 className="my-4 text-2xl">Expense History</h3>
        {localExpense.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <small>
              {item.createdAt.toMillis
                ? new Date(item.createdAt.toMillis()).toISOString()
                : new Date(item.createdAt).toISOString()}
            </small>
            <p className="flex items-center gap-2">
              {currencyFormatter(item.amount)}
              <button
                onClick={() => {
                  deleteExpenseItemHandler(item);
                }}
              >
                <FaRegTrashAlt />
              </button>
            </p>
          </div>
        ))}
      </div>
    </Model>
  );
}

export default ViewExpenseModel;
