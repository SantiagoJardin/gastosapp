import React, { useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ExpenseContext } from '../context/ExpenseContext';

export const MonthSelector = () => {
  const { currentDate, nextMonth, prevMonth } = useContext(ExpenseContext);

  const formatMonth = (date) => {
    const formatter = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' });
    const formatted = formatter.format(date);
    // Capitalize first letter of the month
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      border: '1px solid var(--glass-border)',
      marginBottom: '24px',
      backdropFilter: 'blur(10px)'
    }}>
      <button 
        onClick={prevMonth}
        style={{ 
          padding: '8px', 
          cursor: 'pointer', 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.05)', 
          color: 'var(--text-primary)' 
        }}
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-gradient" style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
        {formatMonth(currentDate)}
      </span>

      <button 
        onClick={nextMonth}
        style={{ 
          padding: '8px', 
          cursor: 'pointer', 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.05)', 
          color: 'var(--text-primary)' 
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
