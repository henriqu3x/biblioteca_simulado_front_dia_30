import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home/Home"
import Login from "../pages/Login/Login"
import NotFound from "../pages/NotFound/NotFound"
import ProtectedRoutes from "./ProtectedRoutes"

const Paths = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<ProtectedRoutes>
               <Home/>
          </ProtectedRoutes>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<ProtectedRoutes>
               <NotFound/>
          </ProtectedRoutes>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Paths
