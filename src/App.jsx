
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Inicio from './pages/Inicio'
import RegistroMascota from './pages/RegistroMascota'
import ListadoMascotas from './pages/ListadoMascotas'
import './App.css'

// Componente principal: organiza las rutas de Mariana Pets.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/registro" element={<RegistroMascota />} />
        <Route path="/mascotas" element={<ListadoMascotas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
