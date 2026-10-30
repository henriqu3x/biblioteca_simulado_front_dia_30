import { NavLink } from "react-router-dom"

const NotFound = () => {
  return (
    <main id="not-found">
      <h1>404</h1>
      <h2>Pagina não encontrada</h2>
      <NavLink to={'/'}>Voltar para pagina inicial</NavLink>
    </main>
  )
}

export default NotFound
