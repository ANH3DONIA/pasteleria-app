import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="breadcrumbs">
      <Link to="/" className="breadcrumb-link">Inicio</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <span key={name}>
            <span className="breadcrumb-separator">/</span>
            {isLast ? (
              <span className="breadcrumb-active">{displayName}</span>
            ) : (
              <Link to={routeTo} className="breadcrumb-link">{displayName}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;
