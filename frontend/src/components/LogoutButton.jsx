import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

const LogoutButton = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return <button className="button button--ghost" onClick={handleLogout}>Logout</button>
}

export default LogoutButton
