
import axios from 'axios'

// Dirección de la API REST de Mariana Pets.
const API_URL = 'http://localhost:8080/api/mascotas'

// Consulta las mascotas registradas en la base de datos.
export async function obtenerMascotas() {
  const respuesta = await axios.get(API_URL)
  return respuesta.data
}

// Registra una mascota en la base de datos.
export async function registrarMascota(mascota) {
  const respuesta = await axios.post(API_URL, mascota)
  return respuesta.data
}
export async function actualizarMascota(id, mascota) {
  const respuesta = await axios.put(`${API_URL}/${id}`, mascota)
  return respuesta.data
}

export async function eliminarMascota(id) {
  const respuesta = await axios.delete(`${API_URL}/${id}`)
  return respuesta.data
}