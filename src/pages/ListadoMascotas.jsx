import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  actualizarMascota,
  eliminarMascota,
  obtenerMascotas,
} from '../services/mascotasService'

// Pantalla para consultar, actualizar y eliminar mascotas registradas en MySQL.
function ListadoMascotas() {
  const ubicacion = useLocation()
  const mensajeExito = ubicacion.state?.mensaje
  const [mascotas, setMascotas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensajeAccion, setMensajeAccion] = useState('')
  const [idEdicion, setIdEdicion] = useState(null)
  const [formularioEdicion, setFormularioEdicion] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    propietario: '',
  })

  useEffect(() => {
    async function cargarMascotas() {
      try {
        const datos = await obtenerMascotas()
        setMascotas(datos)
      } catch {
        setError(
          'No fue posible consultar las mascotas. Verifica que Spring Boot esté funcionando.',
        )
      } finally {
        setCargando(false)
      }
    }

    cargarMascotas()
  }, [])

  async function manejarEliminacion(id, nombre) {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar a ' + nombre + '?',
    )

    if (!confirmar) return

    setError('')
    setMensajeAccion('')

    try {
      const respuesta = await eliminarMascota(id)
      setMensajeAccion(respuesta.mensaje)
      setMascotas(await obtenerMascotas())
    } catch (errorEliminacion) {
      setError(
        errorEliminacion.response?.data?.mensaje ||
          'No fue posible eliminar la mascota.',
      )
    }
  }

  function iniciarEdicion(mascota) {
    setIdEdicion(mascota.id)
    setFormularioEdicion({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: String(mascota.edad),
      propietario: mascota.propietario,
    })
    setError('')
    setMensajeAccion('')
  }

  function manejarCambioEdicion(evento) {
    const { name, value } = evento.target
    setFormularioEdicion((actual) => ({
      ...actual,
      [name]: value,
    }))
  }

  async function guardarEdicion(evento) {
    evento.preventDefault()
    setError('')
    setMensajeAccion('')

    try {
      const respuesta = await actualizarMascota(idEdicion, {
        ...formularioEdicion,
        nombre: formularioEdicion.nombre.trim(),
        especie: formularioEdicion.especie.trim(),
        raza: formularioEdicion.raza.trim(),
        edad: Number(formularioEdicion.edad),
        propietario: formularioEdicion.propietario.trim(),
      })

      setMensajeAccion(respuesta.mensaje)
      setIdEdicion(null)
      setMascotas(await obtenerMascotas())
    } catch (errorActualizacion) {
      setError(
        errorActualizacion.response?.data?.mensaje ||
          'No fue posible actualizar la mascota.',
      )
    }
  }

  return (
    <main className="contenedor">
      <header className="encabezado">
        <h1>Mariana Pets</h1>
        <p>Consulta de mascotas registradas</p>
      </header>

      <section className="tarjeta">
        <h2>Listado de mascotas</h2>

        {mensajeAccion && (
          <p className="mensaje" role="status">
            {mensajeAccion}
          </p>
        )}

        {mensajeExito && (
          <p className="mensaje" role="status">
            {mensajeExito}
          </p>
        )}

        {idEdicion !== null && (
          <form className="formulario" onSubmit={guardarEdicion}>
            <h3>Editar mascota</h3>

            <label htmlFor="editar-nombre">Nombre</label>
            <input
              id="editar-nombre"
              name="nombre"
              value={formularioEdicion.nombre}
              onChange={manejarCambioEdicion}
              required
            />

            <label htmlFor="editar-especie">Especie</label>
            <input
              id="editar-especie"
              name="especie"
              value={formularioEdicion.especie}
              onChange={manejarCambioEdicion}
              required
            />

            <label htmlFor="editar-raza">Raza</label>
            <input
              id="editar-raza"
              name="raza"
              value={formularioEdicion.raza}
              onChange={manejarCambioEdicion}
              required
            />

            <label htmlFor="editar-edad">Edad en años</label>
            <input
              id="editar-edad"
              name="edad"
              type="number"
              min="0"
              step="1"
              value={formularioEdicion.edad}
              onChange={manejarCambioEdicion}
              required
            />

            <label htmlFor="editar-propietario">Propietario</label>
            <input
              id="editar-propietario"
              name="propietario"
              value={formularioEdicion.propietario}
              onChange={manejarCambioEdicion}
              required
            />

            <button className="boton" type="submit">
              Guardar cambios
            </button>
            <button
              className="boton boton-secundario"
              type="button"
              onClick={() => setIdEdicion(null)}
            >
              Cancelar
            </button>
          </form>
        )}

        {cargando ? (
          <p>Cargando información...</p>
        ) : error ? (
          <p className="mensaje" role="alert">
            {error}
          </p>
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
                  <th>Acciones</th>
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
                    <td>
                      <button
                        className="boton boton-secundario"
                        type="button"
                        onClick={() => iniciarEdicion(mascota)}
                      >
                        Editar
                      </button>
                      <button
                        className="boton"
                        type="button"
                        onClick={() =>
                          manejarEliminacion(mascota.id, mascota.nombre)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
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