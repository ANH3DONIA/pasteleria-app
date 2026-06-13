import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { login, user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      addToast('Inicio de sesión exitoso');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) {
    return (
      <div className="page-inner--form" style={{ textAlign: 'center' }}>
        <h2 className="page-title">Hola, {user.nombre}</h2>
        <p className="page-subtitle">Ya has iniciado sesión.</p>
        <button onClick={logout} className="btn-ghost">Cerrar Sesión</button>
      </div>
    );
  }

  return (
    <div className="page-inner--form">
      <h1 className="page-title" style={{ textAlign: 'center' }}>Iniciar Sesión</h1>
      <p className="page-subtitle" style={{ textAlign: 'center' }}>Bienvenido de vuelta.</p>
      
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleLogin} className="card form">
        <div className="form-group">
          <label className="form-label">Correo Electrónico</label>
          <input 
            type="email" 
            required
            placeholder="ejemplo@correo.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-input" 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input 
            type="password" 
            required
            placeholder="Tu contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-input" 
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px' }}>
          Entrar a mi cuenta
        </button>
        <p style={{ textAlign: 'center', margin: '15px 0 0', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
          ¿Aún no tienes cuenta?{' '}
          <Link to="/registro" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
