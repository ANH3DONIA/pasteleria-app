import { useLocation } from 'react-router-dom';

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.key} className="page-transition">
      {children}
    </div>
  );
}

export default PageTransition;
