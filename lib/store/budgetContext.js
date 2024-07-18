"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { authContext } from "./authContext";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export const budgetContext = createContext({
  income: [],
  expenses: [],
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
});

export default function BudgetContextProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const { user } = useContext(authContext);

  const addCategory = async (category) => {
    try {
      const collectionRef = collection(db, "expenses");
      const docSnapshot = await addDoc(collectionRef, {
        uid: user.uid,
        ...category,
        items: [],
      });
      setExpenses((prevExpenses) => {
        return [
          ...prevExpenses,
          {
            id: docSnapshot.id,
            id: user.uid,
            items: [],
            ...category,
          },
        ];
      });
    } catch (error) {
      throw error;
    }
  };

  // Add expense items
  const addExpenseItem = async (expenseCategoryId, newExpense) => {
    const docRef = doc(db, "expenses", expenseCategoryId);

    try {
      await updateDoc(docRef, { ...newExpense });
      // update expense state
      setExpenses((prevState) => {
        const updatedExpenses = [...prevState];

        const foundIndex = updatedExpenses.findIndex((expense) => {
          return expense.id === expenseCategoryId;
        });
        updatedExpenses[foundIndex] = { id: expenseCategoryId, ...newExpense };
        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseItem = async (updatedExpense, expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, {
        ...updatedExpense,
      });

      setExpenses((prevExpenses) => {
        const updatedExpenses = [...prevExpenses];
        const pos = updatedExpenses.findIndex(
          (ex) => ex.id === expenseCategoryId
        );
        updatedExpenses[pos].items = [...updatedExpense.items];
        updatedExpenses[pos].total = updatedExpense.total;

        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  // delete the expense category
  const deleteExpenseCategory = async (expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);
      setExpenses((prevExpenses) => {
        const updatedExpenses = prevExpenses.filter(
          (expense) => expense.id !== expenseCategoryId
        );
        return [...updatedExpenses];
      });
    } catch (error) {}
  };

  const addIncomeItem = async (newIncome) => {
    const collectionRef = collection(db, "income");
    try {
      const docSnapshot = await addDoc(collectionRef, newIncome);
      setIncome((prevState) => [
        ...prevState,
        { id: docSnapshot.id, ...newIncome },
      ]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  const removeIncomeItem = async (incomeId) => {
    const docRef = doc(db, "income", incomeId);
    try {
      await deleteDoc(docRef);
      setIncome((prevState) => prevState.filter((i) => i.id !== incomeId));
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  const values = {
    income,
    expenses,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpenseItem,
    deleteExpenseCategory,
  };

  useEffect(() => {
    if (!user) return;

    const getIncomeData = async () => {
      const collectionRef = collection(db, "income");

      const q = query(collectionRef, where("uid", "==", user.uid));

      const docsSnapshot = await getDocs(q);
      const data = docsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.toMillis()),
      }));
      setIncome(data);
    };

    const getExpensesData = async () => {
      const collectionRef = collection(db, "expenses");

      const q = query(collectionRef, where("uid", "==", user.uid));

      const docsSnapshot = await getDocs(q);

      const data = docsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    };

    getIncomeData();
    getExpensesData();
  }, [user]);

  return (
    <budgetContext.Provider value={values}>{children}</budgetContext.Provider>
  );
}
