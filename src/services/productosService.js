import axios from 'axios'

const API_URL = 'http://localhost:8080/api/productos'

export async function obtenerProductos() {
  const respuesta = await axios.get(API_URL)
  return respuesta.data
}

export async function registrarProducto(producto) {
  const respuesta = await axios.post(API_URL, producto)
  return respuesta.data
}

export async function actualizarProducto(id, producto) {
  const respuesta = await axios.put(`${API_URL}/${id}`, producto)
  return respuesta.data
}

export async function eliminarProducto(id) {
  const respuesta = await axios.delete(`${API_URL}/${id}`)
  return respuesta.data
}
