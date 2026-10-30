import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
     const [token,setToken] = useState(null)
     const [user,setUser] = useState(null)
     const [loading,setLoading] = useState(true)

     useEffect(() => {
          const storedToken = localStorage.getItem('token')
          const storedUser = localStorage.getItem('user')

          if (storedToken && storedUser && !tokenExpirado(storedToken)) {
               setUser(JSON.parse(storedUser))
               setToken(storedToken)

               api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
          } else{
               localStorage.removeItem('token')
               localStorage.removeItem('user')
          }

          setLoading(false)
     },[])

     const tokenExpirado = (token) => {
          try {
               const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))

               return !payload.exp || payload.exp * 1000 <= Date.now()
          } catch (error) {
               return true
          }
     }

     const login = async (email,senha) => {
          try {
               const result = await api.post('/login', {email,senha})

               const {token,user} = result.data.result

               setUser(user)
               setToken(token)

               api.defaults.headers.common.Authorization = `Bearer ${token}`

               localStorage.setItem('user', JSON.stringify(user))
               localStorage.setItem('token', token)
          } catch (error) {
               const message = error.response?.data?.error || error.response?.data?.message

               throw new Error(message);
               
          }
     }

     const logout = () => {
          setUser(null)
          setToken(null)

          delete api.defaults.headers.common.Authorization

          localStorage.removeItem('token')
          localStorage.removeItem('user')
     }

     const isAuthenticated = token ? true : false

     const isAdmin = user?.perfil == 'admin' ? true : false

  return (
    <AuthContext.Provider value={{
     user,
     token,
     loading,
     tokenExpirado,
     login,
     logout,
     isAuthenticated,
     isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
     return useContext(AuthContext)
}