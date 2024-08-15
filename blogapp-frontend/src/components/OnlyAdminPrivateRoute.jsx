import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const OnlyAdminPrivateRoute = () => {
  const user = useSelector((state) => state.auth.user)
  
  return user.isAdmin ? <Outlet /> : <Navigate to="/signin" />
}

export default OnlyAdminPrivateRoute