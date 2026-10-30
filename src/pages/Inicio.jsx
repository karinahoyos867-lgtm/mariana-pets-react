import { Link } from 'react-router-dom'
import '../App.css'

function Inicio() {
  return (
    <main className="contenedor">
      <header className="encabezado">
        <h1>Mariana Pets</h1>
        <p>Cuidamos a quienes llenan nuestra vida de amor.</p>
      </header>

      <section className="tarjeta">
        <h2>¡Bienvenidos!</h2>
        <p>
          Administra la información de tus mascotas y controla los productos
          disponibles en la tienda.
        </p>

        <nav className="acciones" aria-label="Navegación principal">
          <Link className="boton" to="/acceso">
            Iniciar sesión o registrarse
          </Link>
          <Link className="boton" to="/registro">
            Registrar mascota
          </Link>
          <Link className="boton boton-secundario" to="/mascotas">
            Consultar mascotas
          </Link>
          <Link className="boton" to="/productos">
            Gestionar inventario
          </Link>
        </nav>
      </section>

      <footer className="pie">
        <p>Mariana Pets · El bienestar de nuestras mascotas importa.</p>
      </footer>
    </main>
  )
}

export default Inicio
