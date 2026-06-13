import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Registro() {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const { register, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // 1. Registramos al usuario en la API
      await register(formData.nombre, formData.email, formData.password);
      
      // 2. Si es exitoso, iniciamos sesión automáticamente
      await login(formData.email, formData.password);
      
      addToast('¡Cuenta creada con éxito!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-inner--form">
      <h1 className="page-title" style={{ textAlign: 'center' }}>Crear Cuenta</h1>
      <p className="page-subtitle" style={{ textAlign: 'center' }}>
        Únete a La Dulce Vida y disfruta de ofertas exclusivas.
      </p>

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card form">
        <div className="form-group">
          <label className="form-label">Nombre Completo</label>
          <input name="nombre" type="text" placeholder="Tu nombre" required value={formData.nombre} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Correo Electrónico</label>
          <input name="email" type="email" placeholder="tu@correo.com" required value={formData.email} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input name="password" type="password" placeholder="Mínimo 6 caracteres" required minLength="6" value={formData.password} onChange={handleChange} className="form-input" />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px' }}>
          Crear mi Cuenta
        </button>
        <p style={{ textAlign: 'center', margin: '15px 0 0', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Inicia Sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Registro;
