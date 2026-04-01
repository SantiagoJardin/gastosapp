import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GlassContainer } from '../components/GlassContainer';
import { Lock, ShieldCheck, LogIn } from 'lucide-react';

export const LoginView = () => {
  const { login, setup, isSetup } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isSetup) {
        await setup(username, password);
      } else {
        await login(username, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <GlassContainer className="w-full max-w-md animate-slide-up" style={{ padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-blue)',
            marginBottom: '16px',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
          }}>
            <Lock size={32} color="white" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {!isSetup ? 'Cuenta Maestra' : 'Bienvenido'}
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>
            {!isSetup 
              ? 'Parece que es tu primera vez. Crea tu usuario y contraseña de administrador.' 
              : 'Ingresa tus credenciales para acceder a tus consumos.'}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            color: '#ef4444', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'center',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="text-sm font-semibold text-muted" style={{ display: 'block', marginBottom: '8px' }}>Usuario</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Tu usuario"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-muted" style={{ display: 'block', marginBottom: '8px' }}>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
              style={{ width: '100%' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              marginTop: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              opacity: isLoading ? 0.7 : 1
            }}
            disabled={isLoading}
          >
            {!isSetup ? (
              <><ShieldCheck size={20} /> Bloquear y Guardar</>
            ) : (
              <><LogIn size={20} /> Ingresar</>
            )}
          </button>
        </form>
      </GlassContainer>
    </div>
  );
};
