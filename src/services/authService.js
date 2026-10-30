import axios from 'axios'

const API_URL = 'http://localhost:8081/api/auth'

export async function registrarUsuario(usuario) {
  const respuesta = await axios.post(`${API_URL}/register`, usuario)
  return respuesta.data
}

export async function iniciarSesion(credenciales) {
  const respuesta = await axios.post(`${API_URL}/login`, credenciales)
  return respuesta.data
}