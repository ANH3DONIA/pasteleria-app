import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Breadcrumbs from './components/Breadcrumbs'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import Inicio from './pages/Inicio'
import Nosotros from './pages/Nosotros'
import Catalogo from './pages/Catalogo'
import Detalle from './pages/Detalle'
import Personalizado from './pages/Personalizado'
import Carrito from './pages/Carrito'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <main className="page-content">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:id" element={<Detalle />} />
            <Route path="/personalizado" element={<Personalizado />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </>
  )
}

export default App
