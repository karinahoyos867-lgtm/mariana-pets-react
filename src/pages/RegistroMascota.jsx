
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarMascota } from '../services/mascotasService'

// Formulario para validar y registrar mascotas en MySQL.
function RegistroMascota() {
  const navegar = useNavigate()

  const [formulario, setFormulario] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    propietario: '',
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)
  const [guardando, setGuardando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setMensaje('')
    setError(false)

    if (
      !formulario.nombre.trim() ||
      !formulario.especie ||
      !formulario.raza.trim() ||
      !formulario.propietario.trim() ||
      formulario.edad === ''
    ) {
      setMensaje('Completa todos los campos obligatorios.')
      setError(true)
      return
    }

    if (!Number.isInteger(Number(formulario.edad)) ||
        Number(formulario.edad) < 0) {
      setMensaje('La edad debe ser un número entero igual o mayor que cero.')
      setError(true)
      return
    }

    setGuardando(true)

    try {
      await registrarMascota({
        ...formulario,
        nombre: formulario.nombre.trim(),
        raza: formulario.raza.trim(),
        propietario: formulario.propietario.trim(),
        edad: Number(formulario.edad),
      })

      navegar('/mascotas', {
        state: { mensaje: '¡Mascota registrada correctamente!' },
      })
    } catch (errorRegistro) {
      const mensajeServidor = errorRegistro.response?.data?.message

      setMensaje(
        mensajeServidor ||
        'No fue posible registrar la mascota. Verifica que el servidor y la base de datos estén funcionando.'
      )
      setError(true)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="contenedor">
      <header className="encabezado">
        <h1>Mariana Pets</h1>
        <p>Registro de mascotas</p>
      </header>

      <section className="tarjeta">
        <h2>Registrar mascota</h2>
        <p>Todos los campos son obligatorios.</p>

        <form onSubmit={manejarEnvio} className="formulario">
          <label htmlFor="nombre">Nombre de la mascota *</label>
          <input
            id="nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="especie">Especie *</label>
          <select
            id="especie"
            name="especie"
            value={formulario.especie}
            onChange={manejarCambio}
            required
          >
            <option value="">Selecciona una especie</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Otra">Otra</option>
          </select>

          <label htmlFor="raza">Raza *</label>
          <input
            id="raza"
            name="raza"
            value={formulario.raza}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="edad">Edad en años *</label>
          <input
            id="edad"
            name="edad"
            type="number"
            min="0"
            step="1"
            value={formulario.edad}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="propietario">Nombre del propietario *</label>
          <input
            id="propietario"
            name="propietario"
            value={formulario.propietario}
            onChange={manejarCambio}
            required
          />

          <button className="boton" type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Registrar mascota'}
          </button>
        </form>

        {mensaje && (
          <p className="mensaje" role={error ? 'alert' : 'status'}>
            {mensaje}
          </p>
        )}

        <Link to="/">Volver al inicio</Link>
      </section>
    </main>
  )
}

export default RegistroMascota
