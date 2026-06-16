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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    setError(null);
    try {
      await register(formData.nombre, formData.email, formData.password);
      
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
          <input 
            name="password" 
            type="password" 
            placeholder="Mínimo 6 caracteres" 
            required 
            minLength="6" 
            value={formData.password} 
            onChange={handleChange} 
            className="form-input" 
          />
          {formData.password.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '0.8rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '4px', backgroundColor: formData.password.length < 6 ? 'red' : formData.password.match(/[A-Z]/) && formData.password.match(/[0-9]/) ? 'green' : 'orange', borderRadius: '2px' }}></div>
              <span style={{ color: 'var(--color-text-light)' }}>
                {formData.password.length < 6 ? 'Muy corta' : formData.password.match(/[A-Z]/) && formData.password.match(/[0-9]/) ? 'Fuerte' : 'Media'}
              </span>
            </div>
          )}
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px' }} disabled={formData.password.length > 0 && formData.password.length < 6}>
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
