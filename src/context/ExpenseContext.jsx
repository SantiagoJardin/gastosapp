import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const monthlyExpenses = expenses.filter((exp) => {
    if (!exp.date) return false;
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentDate.getMonth() && expDate.getFullYear() === currentDate.getFullYear();
  });

  // Initial Fetch
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [catRes, expRes] = await Promise.all([
          fetch('/api/categories', { headers }),
          fetch('/api/expenses', { headers })
        ]);
        
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
        
        if (expRes.ok) {
          const expData = await expRes.json();
          setExpenses(expData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, isAuthenticated]);

  const addExpense = async (expense) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    
    // Optimistic update
    setExpenses([newExpense, ...expenses]);

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newExpense)
      });
      if (!res.ok) throw new Error('Failed to save to DB');
    } catch (error) {
      console.error(error);
      // Revert if failed (simplified, robust apps would actually rollback)
    }
  };

  const deleteExpense = async (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    try {
      await fetch(`/api/expenses/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addCategory = async (category) => {
    const newCat = { ...category, id: crypto.randomUUID() };
    setCategories([...categories, newCat]);
    
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newCat)
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    try {
      await fetch(`/api/categories/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Cargando datos...</div>;
  }

  return (
    <ExpenseContext.Provider value={{ 
      expenses, 
      monthlyExpenses,
      categories, 
      currentDate,
      prevMonth,
      nextMonth,
      addExpense, 
      deleteExpense, 
      addCategory, 
      deleteCategory 
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
