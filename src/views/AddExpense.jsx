import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { GlassContainer } from '../components/GlassContainer';
import * as icons from 'lucide-react';

export const AddExpense = ({ setActiveTab }) => {
  const { categories, addExpense } = useContext(ExpenseContext);
  
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || !categoryId) return;

    addExpense({
      amount: parseFloat(amount),
      note,
      categoryId,
      type,
      date: new Date().toISOString()
    });

    setActiveTab('dashboard');
  };

  return (
    <div className="animate-slide-up" style={{ padding: '24px 20px', paddingBottom: '100px' }}>
      <h2 className="font-bold text-gradient mb-6" style={{ fontSize: '2rem' }}>
        Nuevo Registro
      </h2>

      <div className="flex mb-6" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
        <button 
          onClick={() => setType('expense')}
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '8px',
            background: type === 'expense' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            color: type === 'expense' ? '#ef4444' : 'var(--text-muted)'
          }}
        >
          Gasto
        </button>
        <button 
          onClick={() => setType('income')}
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '8px',
            background: type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            color: type === 'income' ? '#10b981' : 'var(--text-muted)'
          }}
        >
          Ingreso
        </button>
      </div>

      <GlassContainer>
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          
          <div className="flex-col gap-2">
            <label className="text-sm font-semibold text-muted">Monto</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }}>$</span>
              <input 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00" 
                style={{ paddingLeft: '32px', fontSize: '1.25rem', fontWeight: 'bold' }}
                required 
                autoFocus
              />
            </div>
          </div>

          <div className="flex-col gap-2 mt-4">
            <label className="text-sm font-semibold text-muted">Categoría</label>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}
            >
              {categories.map((cat) => {
                const IconComponent = cat.iconName ? icons[cat.iconName] || icons.Tag : icons.Tag;
                const isSelected = categoryId === cat.id;

                return (
                  <div 
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    style={{
                      padding: '12px',
                      background: isSelected ? `linear-gradient(135deg, ${cat.color}40, transparent)` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? cat.color : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 4px 15px ${cat.color}30` : 'none'
                    }}
                  >
                    <IconComponent color={isSelected ? cat.color : '#94a3b8'} size={24} />
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        color: isSelected ? '#fff' : '#94a3b8',
                        fontWeight: isSelected ? '600' : '400',
                        textAlign: 'center'
                      }}
                    >
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-col gap-2 mt-4 font-semibold text-muted text-sm pb-4" onClick={() => setActiveTab('categories')} style={{ cursor: 'pointer', textAlign: 'right', color: 'var(--accent-blue)'}}>
            + Añadir nueva categoría
          </div>

          <div className="flex-col gap-2">
            <label className="text-sm font-semibold text-muted">Nota (Opcional)</label>
            <input 
              type="text" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder={type === 'income' ? 'Ej. Sueldo de Enero' : 'Ej. Cena con amigos'} 
            />
          </div>

          <button type="submit" className="btn-primary mt-8" style={{ background: type === 'income' ? 'linear-gradient(135deg, #10b981, #059669)' : undefined }}>
            Guardar {type === 'income' ? 'Ingreso' : 'Gasto'}
          </button>
        </form>
      </GlassContainer>
    </div>
  );
};
