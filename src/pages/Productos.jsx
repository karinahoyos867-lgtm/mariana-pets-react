import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  actualizarProducto,
  eliminarProducto,
  obtenerProductos,
  registrarProducto,
} from '../services/productosService'

function fechaLocal() {
  const ahora = new Date()
  return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

function formularioVacio() {
  return {
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    proveedor: '',
    cantidad: '0',
    stock_minimo: '0',
    precio: '',
    fecha_ingreso: fechaLocal(),
    fecha_vencimiento: '',
  }
}

function mensajeDeError(error) {
  return (
    error.response?.data?.detail ||
    error.response?.data?.mensaje ||
    error.response?.data?.message ||
    'No fue posible completar la operación. Verifica que Spring Boot esté funcionando.'
  )
}

function Productos() {
  const [productos, setProductos] = useState([])
  const [formulario, setFormulario] = useState(formularioVacio)
  const [idEdicion, setIdEdicion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    async function cargarProductos() {
      try {
        setProductos(await obtenerProductos())
      } catch (errorCarga) {
        setError(mensajeDeError(errorCarga))
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  function iniciarEdicion(producto) {
    setIdEdicion(producto.id)
    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria,
      proveedor: producto.proveedor,
      cantidad: String(producto.cantidad),
      stock_minimo: String(producto.stock_minimo),
      precio: String(producto.precio),
      fecha_ingreso: producto.fecha_ingreso,
      fecha_vencimiento: producto.fecha_vencimiento || '',
    })
    setError('')
    setMensaje('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicion() {
    setIdEdicion(null)
    setFormulario(formularioVacio())
    setError('')
    setMensaje('')
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    const producto = {
      ...formulario,
      codigo: formulario.codigo.trim(),
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim() || null,
      categoria: formulario.categoria.trim(),
      proveedor: formulario.proveedor.trim(),
      cantidad: Number(formulario.cantidad),
      stock_minimo: Number(formulario.stock_minimo),
      precio: Number(formulario.precio),
      fecha_vencimiento: formulario.fecha_vencimiento || null,
    }

    setGuardando(true)
    try {
      if (idEdicion === null) {
        await registrarProducto(producto)
        setMensaje('Producto registrado correctamente.')
      } else {
        await actualizarProducto(idEdicion, producto)
        setMensaje('Producto actualizado correctamente.')
      }

      setProductos(await obtenerProductos())
      setIdEdicion(null)
      setFormulario(formularioVacio())
    } catch (errorGuardado) {
      setError(mensajeDeError(errorGuardado))
    } finally {
      setGuardando(false)
    }
  }

  async function manejarEliminacion(producto) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el producto ${producto.nombre}?`,
    )
    if (!confirmar) return

    setError('')
    setMensaje('')
    try {
      await eliminarProducto(producto.id)
      setProductos(await obtenerProductos())
      setMensaje('Producto eliminado correctamente.')
      if (idEdicion === producto.id) cancelarEdicion()
    } catch (errorEliminacion) {
      setError(mensajeDeError(errorEliminacion))
    }
  }

  return (
    <main className="contenedor">
      <header className="encabezado">
        <h1>Mariana Pets</h1>
        <p>Control de inventario</p>
      </header>

      <section className="tarjeta">
        <h2>{idEdicion === null ? 'Registrar producto' : 'Editar producto'}</h2>
        <p>Completa los datos del producto. La fecha de vencimiento es opcional.</p>

        {error && <p className="mensaje" role="alert">{error}</p>}
        {mensaje && <p className="mensaje" role="status">{mensaje}</p>}

        <form className="formulario" onSubmit={manejarEnvio}>
          <label htmlFor="producto-codigo">Código *</label>
          <input
            id="producto-codigo"
            name="codigo"
            value={formulario.codigo}
            onChange={manejarCambio}
            maxLength="50"
            required
          />

          <label htmlFor="producto-nombre">Nombre *</label>
          <input
            id="producto-nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            maxLength="120"
            required
          />

          <label htmlFor="producto-descripcion">Descripción</label>
          <input
            id="producto-descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            maxLength="500"
          />

          <label htmlFor="producto-categoria">Categoría *</label>
          <input
            id="producto-categoria"
            name="categoria"
            value={formulario.categoria}
            onChange={manejarCambio}
            maxLength="80"
            required
          />

          <label htmlFor="producto-proveedor">Proveedor *</label>
          <input
            id="producto-proveedor"
            name="proveedor"
            value={formulario.proveedor}
            onChange={manejarCambio}
            maxLength="120"
            required
          />

          <label htmlFor="producto-cantidad">Cantidad disponible *</label>
          <input
            id="producto-cantidad"
            name="cantidad"
            type="number"
            min="0"
            step="1"
            value={formulario.cantidad}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="producto-stock-minimo">Avisar cuando queden *</label>
          <input
            id="producto-stock-minimo"
            name="stock_minimo"
            type="number"
            min="0"
            step="1"
            value={formulario.stock_minimo}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="producto-precio">Precio *</label>
          <input
            id="producto-precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={formulario.precio}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="producto-fecha-ingreso">Fecha de ingreso *</label>
          <input
            id="producto-fecha-ingreso"
            name="fecha_ingreso"
            type="date"
            value={formulario.fecha_ingreso}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="producto-fecha-vencimiento">Fecha de vencimiento</label>
          <input
            id="producto-fecha-vencimiento"
            name="fecha_vencimiento"
            type="date"
            value={formulario.fecha_vencimiento}
            onChange={manejarCambio}
          />

          <button className="boton" type="submit" disabled={guardando}>
            {guardando
              ? 'Guardando...'
              : idEdicion === null
                ? 'Registrar producto'
                : 'Guardar cambios'}
          </button>

          {idEdicion !== null && (
            <button
              className="boton boton-secundario"
              type="button"
              onClick={cancelarEdicion}
            >
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="tarjeta">
        <h2>Productos registrados</h2>

        {cargando ? (
          <p>Cargando inventario...</p>
        ) : productos.length === 0 ? (
          <p>Aún no hay productos registrados.</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Proveedor</th>
                  <th>Existencias</th>
                  <th>Precio</th>
                  <th>Vencimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => {
                  const stockBajo =
                    producto.cantidad <= producto.stock_minimo
                  return (
                    <tr key={producto.id}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>{producto.proveedor}</td>
                      <td>
                        {producto.cantidad}
                        {stockBajo && (
                          <strong> · Reponer</strong>
                        )}
                      </td>
                      <td>
                        {Number(producto.precio).toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                        })}
                      </td>
                      <td>{producto.fecha_vencimiento || 'No aplica'}</td>
                      <td>
                        <button
                          className="boton boton-secundario"
                          type="button"
                          onClick={() => iniciarEdicion(producto)}
                        >
                          Editar
                        </button>
                        <button
                          className="boton"
                          type="button"
                          onClick={() => manejarEliminacion(producto)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <nav className="acciones" aria-label="Navegación">
        <Link to="/" className="boton boton-secundario">
          Volver al inicio
        </Link>
      </nav>
    </main>
  )
}

export default Productos
