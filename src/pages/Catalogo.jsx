import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Search } from 'lucide-react';

const CATEGORIES = [
  { key: 'todos',    label: 'Todos' },
  { key: 'pasteles', label: 'Pasteles' },
  { key: 'tartas',   label: 'Tartas' },
  { key: 'postres',  label: 'Postres' },
];

const SORT_OPTIONS = [
  { key: 'default',    label: 'Relevancia' },
  { key: 'price-asc',  label: 'Precio: menor a mayor' },
  { key: 'price-desc', label: 'Precio: mayor a menor' },
  { key: 'name-asc',   label: 'Nombre A–Z' },
];

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('default');
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => setProductos([]));
  }, []);

  const productosFiltrados = productos
    .filter(p => {
      const coincideCategoria = categoria === 'todos' || p.category === categoria;
      const coincideBusqueda  = p.name.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      if (orden === 'price-asc')  return a.price - b.price;
      if (orden === 'price-desc') return b.price - a.price;
      if (orden === 'name-asc')   return a.name.localeCompare(b.name);
      return 0;
    });

  const handleAddToCart = (producto) => {
    const success = addToCart(producto);
    if (success) {
      addToast(`${producto.name} agregado a tu pedido`);
    } else {
      addToast(`Solo puedes pedir hasta 10 unidades de ${producto.name}`, 'warning');
    }
  };

  return (
    <div className="page-inner">
      <h1 className="page-title">Nuestro Catálogo</h1>

      <div className="catalog-toolbar">
        <div className="catalog-search">
          <Search size={16} color="var(--color-text-light)" className="search-icon" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="catalog-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoria(cat.key)}
              className={`filter-btn ${categoria === cat.key ? 'filter-btn--active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <select
          value={orden}
          onChange={e => setOrden(e.target.value)}
          className="sort-select"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="catalog-empty">
          <p>No encontramos productos con ese criterio.</p>
          <button className="btn-ghost" onClick={() => { setCategoria('todos'); setBusqueda(''); setOrden('default'); }}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {productosFiltrados.map(producto => (
            <div key={producto.id} className="product-card">
              <div className="product-img-wrapper">
                <Link to={`/catalogo/${producto.id}`}>
                  <img src={producto.image} alt={producto.name} className="product-img" />
                </Link>
              </div>
              <div className="product-info">
                <span className="product-category-badge">{producto.category}</span>
                <Link to={`/catalogo/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ marginTop: '8px', marginBottom: '6px' }}>{producto.name}</h3>
                </Link>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-light)', marginBottom: '12px' }}>{producto.description}</p>
                <p style={{ fontWeight: '700', color: 'var(--color-accent)', fontSize: '1.2rem', margin: '0 0 12px' }}>
                  ${producto.price.toFixed(2)}
                </p>
                <button onClick={() => handleAddToCart(producto)} className="btn-primary" style={{ width: '100%' }}>
                  Agregar a mi Pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogo;
