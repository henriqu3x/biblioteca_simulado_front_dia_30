import { AuthProvider } from "./contexts/AuthContext"
import Paths from "./routes/Paths"

const App = () => {
  return (
      <AuthProvider>
        <Paths/>
      </AuthProvider>
  )
}

export default App
