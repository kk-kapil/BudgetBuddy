"use client"
import { useRef, useContext } from "react";
import { currencyFormatter } from "@/lib/utils";
import { budgetContext } from '@/lib/store/budgetContext';
import { authContext } from "@/lib/store/authContext";
import { FaRegTrashAlt } from 'react-icons/fa';
import Model from "@/components/Model";
import { toast } from "react-toastify";

function AddIncomeModal({ show, onClose }) {
    const amountRef = useRef();
    const descriptionRef = useRef();
    const { income, addIncomeItem, removeIncomeItem } = useContext(budgetContext);

    const {user} = useContext(authContext);

    const addIncomeHandler = async (e) => {
        e.preventDefault();
        const newIncome = {
            amount: +amountRef.current.value,
            description: descriptionRef.current.value,
            createdAt: new Date(),
            uid: user.uid,
        };
        try {
            await addIncomeItem(newIncome);
            descriptionRef.current.value = "";
            amountRef.current.value = "";
            toast.success("Income added successfully");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const deleteIncomeEntryHandler = async (incomeId) => {
        try {
            await removeIncomeItem(incomeId);
            toast.success("Income entry deleted");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    return (
        <Model show={show} onClose={onClose}>
            <form className="inputs" onSubmit={addIncomeHandler}>
                <div className="inputs">
                    <label htmlFor="amount">Income Amount</label>
                    <input
                        className="px-4 py-2 bg-slate-600 rounded-xl"
                        type="number"
                        name="amount"
                        ref={amountRef}
                        min={0.01}
                        step={0.01}
                        placeholder="Enter the income amount"
                        required
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="description">Description</label>
                    <input
                        className="px-4 py-2 bg-slate-600 rounded-xl"
                        type="text"
                        ref={descriptionRef}
                        name="description"
                        placeholder="Enter description of income"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary self-start">Add entry</button>
            </form>
            <div className="flex flex-col gap-4 mt-6 max-h-[60vh] overflow-y-auto">
                <h3 className="text-2xl font-bold gap-4 mt-6">Income History</h3>
                {income.map(i => (
                    <div className="flex items-center justify-between" key={i.id}>
                        <div>
                            <p className="font-semibold">{i.description}</p>
                            <small className="text-xs">{i.createdAt.toISOString()}</small>
                        </div>
                        <p className="flex items-center gap-2">{currencyFormatter(i.amount)}</p>
                        <button onClick={() => deleteIncomeEntryHandler(i.id)}>
                            <FaRegTrashAlt />
                        </button>
                    </div>
                ))}
            </div>
        </Model>
    );
}

export default AddIncomeModal;
