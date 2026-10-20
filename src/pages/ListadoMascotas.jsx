
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { obtenerMascotas } from '../services/mascotasService'

// Pantalla de consulta de mascotas registradas en MySQL.
function ListadoMascotas() {
  const ubicacion = useLocation()
  const mensajeExito = ubicacion.state?.mensaje
  const [mascotas, setMascotas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarMascotas() {
      try {
        const datos = await obtenerMascotas()
        setMascotas(datos)
      } catch (errorConsulta) {
        setError(
          'No fue posible consultar las mascotas. Verifica que Spring Boot esté funcionando.'
        )
      } finally {
        setCargando(false)
      }
    }

    cargarMascotas()
  }, [])

  return (
    <main className="contenedor">
      <header className="encabezado">
        <h1>Mariana Pets</h1>
        <p>Consulta de mascotas registradas</p>
      </header>

      <section className="tarjeta">
        <h2>Listado de mascotas</h2>
{mensajeExito && (
  <p className="mensaje" role="status">
    {mensajeExito}
  </p>
)}
        {cargando ? (
          <p>Cargando información...</p>
        ) : error ? (
          <p className="mensaje" role="alert">{error}</p>
        ) : mascotas.length === 0 ? (
          <p>No hay mascotas registradas.</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Especie</th>
                  <th>Raza</th>
                  <th>Edad</th>
                  <th>Propietario</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((mascota) => (
                  <tr key={mascota.id}>
                    <td>{mascota.nombre}</td>
                    <td>{mascota.especie}</td>
                    <td>{mascota.raza}</td>
                    <td>{mascota.edad}</td>
                    <td>{mascota.propietario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/" className="boton boton-secundario">
          Volver al inicio
        </Link>
      </section>
    </main>
  )
}

export default ListadoMascotas
