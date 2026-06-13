import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { ChevronRight } from 'lucide-react';

const PASO_FORM = 'form';
const PASO_PREVIEW = 'preview';

function Personalizado() {
  const [paso, setPaso] = useState(PASO_FORM);
  const [formData, setFormData] = useState({ personas: '', sabor: '', relleno: '', tema: '' });
  const { addToast } = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePreview = (e) => {
    e.preventDefault();
    setPaso(PASO_PREVIEW);
  };

  const handleSubmit = () => {
    addToast('¡Solicitud enviada! Te contactaremos pronto.');
    setFormData({ personas: '', sabor: '', relleno: '', tema: '' });
    setPaso(PASO_FORM);
  };

  return (
    <div className="page-inner--form">
      <h1 className="page-title" style={{ textAlign: 'center' }}>Cotiza tu Pastel Ideal</h1>
      <p className="page-subtitle" style={{ textAlign: 'center' }}>
        Cuéntanos cómo imaginas tu pastel para bodas, quinceañeras o eventos especiales.
      </p>

      <div className="stepper">
        <div className={`stepper-step ${paso === PASO_FORM ? 'stepper-step--active' : 'stepper-step--done'}`}>
          <span className="stepper-num">1</span> Detalles
        </div>
        <ChevronRight size={16} color="var(--color-text-light)" />
        <div className={`stepper-step ${paso === PASO_PREVIEW ? 'stepper-step--active' : ''}`}>
          <span className="stepper-num">2</span> Confirmar
        </div>
      </div>

      {paso === PASO_FORM ? (
        <form onSubmit={handlePreview} className="card form">
          <div className="form-group">
            <label className="form-label">Número de Personas</label>
            <select name="personas" required className="form-input" value={formData.personas} onChange={handleChange}>
              <option value="">Selecciona una opción</option>
              <option value="10-20">10 a 20 personas</option>
              <option value="20-50">20 a 50 personas</option>
              <option value="50+">Más de 50 personas</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sabor del Pan</label>
            <input name="sabor" type="text" placeholder="Ej. Vainilla, Red Velvet, Limón..." required className="form-input" value={formData.sabor} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Sabor del Relleno</label>
            <input name="relleno" type="text" placeholder="Ej. Crema de fresas, Nutella, Dulce de leche..." required className="form-input" value={formData.relleno} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Temática o Descripción</label>
            <textarea name="tema" rows="4" placeholder="Describe colores, flores o temática especial." required className="form-input" style={{ resize: 'vertical' }} value={formData.tema} onChange={handleChange} />
          </div>
          <button type="submit" className="btn-primary btn-icon" style={{ width: '100%', padding: '13px', justifyContent: 'center' }}>
            Ver Resumen <ChevronRight size={16} />
          </button>
        </form>
      ) : (
        <div className="card">
          <h2 className="section-title" style={{ marginTop: 0 }}>Resumen de tu Solicitud</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            {[
              { label: 'Personas',     valor: formData.personas },
              { label: 'Sabor del pan', valor: formData.sabor },
              { label: 'Relleno',      valor: formData.relleno },
              { label: 'Temática',     valor: formData.tema },
            ].map(({ label, valor }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{label}</span>
                <span style={{ fontWeight: '600', maxWidth: '60%', textAlign: 'right' }}>{valor}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setPaso(PASO_FORM)}>
              Editar
            </button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
              Confirmar y Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Personalizado;
