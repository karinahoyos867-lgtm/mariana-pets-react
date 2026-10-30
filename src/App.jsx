import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Inicio from './pages/Inicio'
import RegistroMascota from './pages/RegistroMascota'
import ListadoMascotas from './pages/ListadoMascotas'
import Productos from './pages/Productos'
import './App.css'
import Autenticacion from './pages/Autenticacion'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/acceso" element={<Autenticacion />} />
        <Route path="/registro" element={<RegistroMascota />} />
        <Route path="/mascotas" element={<ListadoMascotas />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
