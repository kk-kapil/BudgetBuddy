"use client";
import { useState, useContext, useEffect } from "react";
import ExpenseCategoryItems from "@/components/ExpenseCategoryItems";
import { currencyFormatter } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { budgetContext } from "@/lib/store/budgetContext";
import { authContext } from "@/lib/store/authContext";
import AddIncomeModal from "@/components/modals/AddIncomeModal";
import AddExpensesModal from "@/components/modals/AddExpensesModal";
import SignIn from "@/components/SignIn";



ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddIncomeModel, setShowAddIncomeModel] = useState(false);
  const { income, expenses } = useContext(budgetContext);
  const{user }  = useContext(authContext);
  const [Balance, setBalance] = useState(0);

  useEffect(() => {
    const newBalance =
      income.reduce((total, i) => {
        return total + i.amount;
      }, 0) -
      expenses.reduce((total, e) => {
        return total + e.total;
      }, 0);
    setBalance(newBalance);
  }, [expenses, income]);

  if(!user)
  {
    return <SignIn/>
  }


  return (
    <>
      {/* add income model */}
      <AddIncomeModal
        show={showAddIncomeModel}
        onClose={() => setShowAddIncomeModel(false)}
      />

      {/* add expense modal */}
      <AddExpensesModal
        show={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
      />

      <main className="container max-w-2xl px-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(Balance)}</h2>
        </section>
        <section className="flex items-center gap-2 py-3">
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="btn btn-primary"
          >
            {" "}
            + Expenses
          </button>
          <button
            onClick={() => setShowAddIncomeModel(true)}
            className="btn btn-primary-outline"
          >
            {" "}
            + Income{" "}
          </button>
        </section>
        <section className="py-6">
          <h3 className="text-2xl">My Expense</h3>
          <div className="flex flex-col gap-4 mt-6">
            {expenses.map((expense) => (
              <ExpenseCategoryItems key={expense.id} expense={expense} />
            ))}
          </div>
        </section>
        {/* chart section */}

        <section className="py-6">
        <a id="stats"/>
          <h3 className="text-2xl"> Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut
              data={{
                labels: expenses.map((expense) => expense.title),
                datasets: [
                  {
                    label: "Expenses",
                    data: expenses.map((expense) => expense.total),
                    backgroundColor: expenses.map((expense) => expense.color),
                    borderColor: ["#18181b"],
                    borderWidth: 5,
                  },
                ],
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
