import React, { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExpenseContext } from '../context/ExpenseContext';
import { GlassContainer } from '../components/GlassContainer';
import { ExpenseCard } from '../components/ExpenseCard';
import { MonthSelector } from '../components/MonthSelector';
import { Wallet } from 'lucide-react';

export const Dashboard = () => {
  const { monthlyExpenses, categories } = useContext(ExpenseContext);

  const totalBalance = monthlyExpenses.reduce((sum, exp) => {
    return exp.type === 'income' 
      ? sum + parseFloat(exp.amount) 
      : sum - parseFloat(exp.amount);
  }, 0);

  // Group expenses by category for the chart (ONLY expenses)
  const expensesByCategory = monthlyExpenses
    .filter(exp => exp.type !== 'income')
    .reduce((acc, exp) => {
      acc[exp.categoryId] = (acc[exp.categoryId] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});

  const chartData = Object.keys(expensesByCategory).map(catId => {
    const category = categories.find(c => c.id === catId);
    return {
      name: category ? category.name : 'Unknown',
      value: expensesByCategory[catId],
      color: category ? category.color : '#cbd5e1'
    };
  }).sort((a, b) => b.value - a.value); // Sort by highest spend

  return (
    <div className="animate-slide-up" style={{ padding: '24px 20px', paddingBottom: '100px' }}>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-muted text-sm font-semibold">Balance Total</h2>
          <h1 className="font-bold text-gradient" style={{ fontSize: '2.5rem' }}>
            ${totalBalance.toFixed(2)}
          </h1>
        </div>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '16px' }}>
          <Wallet size={32} color="#3b82f6" />
        </div>
      </header>

      <MonthSelector />

      {chartData.length > 0 ? (
        <GlassContainer className="mb-8" style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 className="w-full text-center text-sm font-semibold mb-2">Gastos por Categoría</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </GlassContainer>
      ) : (
        <GlassContainer className="mb-8 text-center" style={{ padding: '40px 20px' }}>
          <p className="text-muted">No hay gastos registrados aún.</p>
        </GlassContainer>
      )}

      <div>
        <h3 className="font-semibold mb-4 text-muted">Últimos Movimientos</h3>
        {monthlyExpenses.length > 0 ? (
          monthlyExpenses.slice(0, 10).map(expense => (
            <ExpenseCard 
              key={expense.id} 
              expense={expense} 
              category={categories.find(c => c.id === expense.categoryId)} 
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted mt-4">No hay movimientos en este mes.</p>
        )}
      </div>
    </div>
  );
};
