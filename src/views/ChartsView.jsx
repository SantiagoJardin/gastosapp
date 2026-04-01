import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { GlassContainer } from '../components/GlassContainer';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { MonthSelector } from '../components/MonthSelector';

export const ChartsView = () => {
  const { monthlyExpenses, categories } = useContext(ExpenseContext);

  // Filter only expenses (ignore income if it exists)
  const expenseLogs = monthlyExpenses.filter(e => e.type !== 'income');

  // Group and sum by category
  const categorySums = {};
  expenseLogs.forEach(exp => {
    if (!categorySums[exp.categoryId]) {
      categorySums[exp.categoryId] = 0;
    }
    categorySums[exp.categoryId] += parseFloat(exp.amount);
  });

  const totalExpenses = Object.values(categorySums).reduce((acc, val) => acc + val, 0);

  // Prepare data for recharts
  const chartData = Object.keys(categorySums).map(categoryId => {
    const category = categories.find(c => c.id === categoryId) || { name: 'Desconocido', color: '#ccc' };
    return {
      name: category.name,
      value: categorySums[categoryId],
      color: category.color,
      percentage: totalExpenses > 0 ? ((categorySums[categoryId] / totalExpenses) * 100).toFixed(1) : 0
    };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);

  const customTooltipFormatter = (value, name, props) => {
    return [
      `$${value.toFixed(2)} (${props.payload.percentage}%)`,
      name
    ];
  };

  return (
    <div className="animate-slide-up" style={{ padding: '24px 20px', paddingBottom: '100px' }}>
      <header className="flex items-center gap-3 mb-8">
        <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '12px', borderRadius: '16px' }}>
          <PieChartIcon size={28} color="#a855f7" />
        </div>
        <h1 className="font-bold text-gradient" style={{ fontSize: '2rem' }}>Consumos</h1>
      </header>

      <MonthSelector />

      {chartData.length > 0 ? (
        <GlassContainer className="mb-8" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <h3 className="w-full text-center text-sm font-semibold mb-4 text-muted pt-4">Consumo por Categoría (%)</h3>
          

          <div style={{ width: '100%', height: '400px', paddingBottom: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  animationDuration={800}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'var(--text-muted)', strokeWidth: 1 }}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={customTooltipFormatter}
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: '500' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={50} 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '10px' }}
                  formatter={(value, entry) => (
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {value} <span className="text-muted">({entry.payload.percentage}%)</span>
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassContainer>
      ) : (
        <GlassContainer className="mb-8 text-center" style={{ padding: '60px 20px' }}>
          <p className="text-muted">No hay gastos registrados en este mes para analizar.</p>
        </GlassContainer>
      )}
    </div>
  );
};
