import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  iniciarSesion,
  registrarUsuario,
} from '../services/authService'
import '../App.css'

function Autenticacion() {
  const [modo, setModo] = useState('login')
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
  })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const esRegistro = modo === 'registro'

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo)
    setMensaje('')
    setError('')
  }

  function actualizarCampo(evento) {
    const { name, value } = evento.target
    setFormulario({ ...formulario, [name]: value })
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensaje('')
    setError('')

    try {
      const respuesta = esRegistro
        ? await registrarUsuario(formulario)
        : await iniciarSesion({
            correo: formulario.correo,
            contrasena: formulario.contrasena,
          })

      setMensaje(respuesta.mensaje)
    } catch (errorSolicitud) {
      setError(
        errorSolicitud.response?.data?.mensaje ||
          'No fue posible conectar con el servicio de autenticación.',
      )
    }
  }

  return (
    <main className="contenedor">
      <header className="encabezado">
        <h1>Mariana Pets</h1>
        <p>Acceso de usuarios</p>
      </header>

      <section className="tarjeta">
        <h2>{esRegistro ? 'Crear una cuenta' : 'Iniciar sesión'}</h2>

        <nav className="acciones" aria-label="Tipo de acceso">
          <button
            className="boton"
            type="button"
            onClick={() => cambiarModo('login')}
          >
            Iniciar sesión
          </button>
          <button
            className="boton boton-secundario"
            type="button"
            onClick={() => cambiarModo('registro')}
          >
            Registrarse
          </button>
        </nav>

        <form className="formulario" onSubmit={enviarFormulario}>
          {esRegistro && (
            <>
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={actualizarCampo}
                maxLength="80"
                required
              />
            </>
          )}

          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={formulario.correo}
            onChange={actualizarCampo}
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            value={formulario.contrasena}
            onChange={actualizarCampo}
            minLength={esRegistro ? 8 : undefined}
            required
          />

          <button className="boton" type="submit">
            {esRegistro ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        {mensaje && <p className="mensaje" role="status">{mensaje}</p>}
        {error && <p className="mensaje" role="alert">{error}</p>}

        <Link to="/">Volver al inicio</Link>
      </section>
    </main>
  )
}

export default Autenticacion