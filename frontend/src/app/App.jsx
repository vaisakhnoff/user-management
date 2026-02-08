import Login from '../pages/Login'
import Register from '../pages/Register'
import AdminDashboard from '../pages/AdminDashboard'
import Home from '../pages/Home'

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../routes/ProtectedRoute'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from '../features/auth/authSlice'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loadUser())
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route
          path='/home'
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
