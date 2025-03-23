import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000" || process.env.REACT_APP_API_URL;

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [user,setUser]=useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("user")
  );

  // ✅ Fetch data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getIncomes();
      getExpenses();
    }
  }, [isAuthenticated]);

  // ✅ Add Income
  const addIncome = async (income) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/transactions/add-income`, income, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Income Added:", response.data);
      getIncomes();
    } catch (err) {
      console.error("Add Income Error:", err.response);
      setError(err.response?.data?.message || "Error adding income");
    }
  };

  // ✅ Fetch Incomes
  const getIncomes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/transactions/get-incomes`);
      console.log("Fetched Incomes:", response.data);
      setIncomes(response.data);
    } catch (err) {
      console.error("Fetch Income Error:", err.response);
      setError(err.response?.data?.message || "Error fetching incomes");
    }
  };

  // ✅ Delete Income
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/transactions/delete-income/${id}`);
      getIncomes();
    } catch (err) {
      console.error("Delete Income Error:", err.response);
      setError(err.response?.data?.message || "Error deleting income");
    }
  };

  // ✅ Total Income
  const totalIncome = () =>
    incomes.reduce((total, income) => total + income.amount, 0);

  // ✅ Add Expense
  const addExpense = async (expense) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/transactions/add-expense`, expense, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Expense Added:", response.data);
      getExpenses();
    } catch (err) {
      console.error("Add Expense Error:", err.response);
      setError(err.response?.data?.message || "Error adding expense");
    }
  };

  // ✅ Fetch Expenses
  const getExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/transactions/get-expenses`);
      console.log("Fetched Expenses:", response.data);
      setExpenses(response.data);
    } catch (err) {
      console.error("Fetch Expense Error:", err.response);
      setError(err.response?.data?.message || "Error fetching expenses");
    }
  };

  // ✅ Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/transactions/delete-expense/${id}`);
      getExpenses();
    } catch (err) {
      console.error("Delete Expense Error:", err.response);
      setError(err.response?.data?.message || "Error deleting expense");
    }
  };

  // ✅ Total Expenses
  const totalExpenses = () =>
    expenses.reduce((total, expense) => total + expense.amount, 0);

  // ✅ Total Balance
  const totalBalance = () => totalIncome() - totalExpenses();

  // ✅ Recent Transactions
  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        user,
        setUser,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
        isAuthenticated,
        setIsAuthenticated,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
