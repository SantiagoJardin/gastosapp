import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { GlassContainer } from '../components/GlassContainer';
import * as icons from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
const ICONS = ['ShoppingCart', 'Utensils', 'Car', 'Home', 'Heart', 'Zap', 'Gamepad2', 'Briefcase', 'Coffee', 'Gift', 'Plane', 'Smartphone'];

export const ManageCategories = () => {
  const { categories, addCategory, deleteCategory } = useContext(ExpenseContext);
  
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [iconName, setIconName] = useState(ICONS[0]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name) return;

    addCategory({ name, color, iconName });
    setName('');
    setColor(COLORS[0]);
    setIconName(ICONS[0]);
  };

  return (
    <div className="animate-slide-up" style={{ padding: '24px 20px', paddingBottom: '100px' }}>
      <h2 className="font-bold text-gradient mb-6" style={{ fontSize: '2rem' }}>
        Categorías
      </h2>

      <GlassContainer className="mb-8">
        <h3 className="font-semibold mb-4 text-sm text-muted">Añadir Nueva</h3>
        <form onSubmit={handleCreate} className="flex-col gap-4">
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nombre de categoría" 
            required 
          />

          <div className="mt-2">
            <label className="text-xs text-muted mb-2 block">Color</label>
            <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
              {COLORS.map(c => (
                <div 
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '3px solid white' : 'none',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-2 text-muted text-xs flex items-center justify-between">
            <button type="submit" className="btn-primary mt-2">
              Crear
            </button>
          </div>
        </form>
      </GlassContainer>

      <div>
        <h3 className="font-semibold mb-4 text-muted">Tus Categorías</h3>
        <div className="flex-col gap-2">
          {categories.map(cat => {
            const IconComponent = cat.iconName ? icons[cat.iconName] || icons.Tag : icons.Tag;
            return (
              <div 
                key={cat.id}
                className="flex items-center justify-between"
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${cat.color}40, transparent)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cat.color
                    }}
                  >
                    <IconComponent size={20} />
                  </div>
                  <span className="font-semibold">{cat.name}</span>
                </div>
                {categories.length > 1 && (
                  <button 
                    onClick={() => deleteCategory(cat.id)}
                    style={{ color: 'var(--danger)', padding: '8px' }}
                  >
                    <icons.Trash2 size={20} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
