import { useState } from 'react'
import './login.css'
import Toast from '../../components/Toast/Toast'
import logo from '../../assets/logo-bg.png'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
     const [email,setEmail] = useState('')
     const [senha,setSenha] = useState('')
     const [error,setError] = useState('')

     const {login} = useAuth()
     const navigate = useNavigate()

     const fazerLogin = async (e) => {
          e.preventDefault()
          try {
               setError('')

               await login(email,senha)

               navigate('/')
          } catch (error) {
               setError(error.message)
          }
     }


  return (
    <main id="login">
     <section className="box-info">
          <div>
               <img src={logo} alt="logo" />
          </div>
          <p>Acesso autorizado somente a funcionarios</p>
     </section>
     <section className="box-form">
          <div className="title">
               <h2>Fazer Login</h2>
               <p>Insira seus dados para acessar a plataforma</p>
          </div>

          <form onSubmit={fazerLogin}>
               <div className="label-input">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id='email' name='email' required placeholder='Digite seu email'/>
               </div>
               <div className="label-input">
                    <label htmlFor="senha">Senha</label>
                    <input onChange={(e) => setSenha(e.target.value)} type="password" id='senha' name='senha' required placeholder='Digite sua senha'/>
               </div>
               <button type='submit' aria-label='btn'>Fazer Login</button>
          </form>
     </section>

      {error? <Toast tipo='error' message={error}/> : null}
    </main>
  )
}

export default Login
