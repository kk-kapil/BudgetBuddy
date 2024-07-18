import { currencyFormatter } from "@/lib/utils";
import ViewExpenseModel from "./modals/ViewExpenseModel";
import { useState } from "react";

function ExpenseCategoryItems({ expense }) {
  const [showViewExpenseModel, setViewExpenseModel] = useState(false);
  return (
    <>
      <ViewExpenseModel
        show={showViewExpenseModel}
        onClose={setViewExpenseModel}
        expense={expense}
      />
      <button
        onClick={() => {
          setViewExpenseModel(true);
        }}
      >
        <div className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl">
          <div className="flex items-center gap-2">
            <div
              className="w-[25px] h-[25px] rounded-full"
              style={{ backgroundColor: expense.color }}
            ></div>
            <h4 className="capitalize">{expense.title}</h4>
          </div>
          <p>{currencyFormatter(expense.total)}</p>
        </div>
      </button>
    </>
  );
}

export default ExpenseCategoryItems;
