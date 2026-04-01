import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import * as icons from 'lucide-react';

export const ExpenseCard = ({ expense, category }) => {
  const { deleteExpense } = useContext(ExpenseContext);
  const IconComponent = category?.iconName ? icons[category.iconName] || icons.Circle : icons.Circle;

  const isIncome = expense.type === 'income';

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        marginBottom: '12px'
      }}
    >
      <div className="flex items-center gap-4">
        <div 
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${category?.color || '#a78bfa'}40, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: category?.color || '#a78bfa'
          }}
        >
          <IconComponent size={24} />
        </div>
        <div className="flex-col">
          <span className="font-semibold">{expense.note || category?.name || (isIncome ? 'Ingreso' : 'Gasto')}</span>
          <span className="text-sm text-muted">
            {new Date(expense.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div 
          className="font-bold" 
          style={{ 
            fontSize: '1.1rem',
            color: isIncome ? '#10b981' : '#f87171' // green for income, red for expense
          }}
        >
          {isIncome ? '+' : '-'}${parseFloat(expense.amount).toFixed(2)}
        </div>
        
        <button 
          onClick={() => deleteExpense(expense.id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <icons.Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
