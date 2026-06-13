import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const infoItems = [
  { Icon: MapPin, titulo: 'Dirección',  detalle: 'Calle Dulce #42, Col. Centro' },
  { Icon: Phone,  titulo: 'Teléfono',   detalle: '+52 (555) 123-4567' },
  { Icon: Mail,   titulo: 'Correo',     detalle: 'hola@ladulcevida.mx' },
  { Icon: Clock,  titulo: 'Horario',    detalle: 'Lun–Sáb: 9:00am – 8:00pm\nDom: 10:00am – 5:00pm' },
];

function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setEnviado(true); };

  return (
    <div className="page-inner">
      <h1 className="page-title">Contáctanos</h1>
      <p className="page-subtitle">
        ¿Tienes alguna pregunta o quieres hacer un pedido especial? Escríbenos y te respondemos a la brevedad.
      </p>

      <div className="two-col-grid">
        <div>
          {enviado ? (
            <div className="card card-center" style={{ padding: '48px 28px' }}>
              <div className="feature-icon-wrap" style={{ margin: '0 auto 16px' }}>
                <Mail size={26} strokeWidth={1.5} color="var(--color-secondary)" />
              </div>
              <h3 className="page-title" style={{ marginTop: '0' }}>¡Mensaje enviado!</h3>
              <p className="page-subtitle" style={{ marginBottom: '20px' }}>Nos pondremos en contacto contigo pronto.</p>
              <button className="btn-primary" onClick={() => { setEnviado(false); setFormData({ nombre: '', email: '', mensaje: '' }); }}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card form">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input name="nombre" type="text" placeholder="Tu nombre completo" required value={formData.nombre} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input name="email" type="email" placeholder="tu@correo.com" required value={formData.email} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Mensaje</label>
                <textarea name="mensaje" rows="5" placeholder="Escribe tu mensaje aquí..." required value={formData.mensaje} onChange={handleChange} className="form-input" style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-primary">Enviar Mensaje</button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {infoItems.map(({ Icon, titulo, detalle }) => (
            <div key={titulo} className="info-card">
              <div className="info-card-icon">
                <Icon size={18} strokeWidth={1.75} color="var(--color-secondary)" />
              </div>
              <div>
                <p className="info-card-title">{titulo}</p>
                <p className="info-card-body">{detalle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contacto;
