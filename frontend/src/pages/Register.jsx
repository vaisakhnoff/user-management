import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../features/auth/authSlice'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setValidationErrors({ ...validationErrors, [e.target.name]: '' })
  }

  const validateForm = () => {
    const errors = {}
    
    if (!form.name.trim()) {
      errors.name = 'Name is required'
    } else if (form.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!form.password.trim()) {
      errors.password = 'Password is required'
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setValidationErrors({})
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // dispatch thunk and unwrap to catch errors
      await dispatch(registerUser(form)).unwrap()
      setSuccess('User created successfully! Redirecting to login...')
      // give user a moment to read the message
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(err || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page--auth">
      <h2 className="page-title">Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <input className="input" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          {validationErrors.name && <p className="form-error">{validationErrors.name}</p>}
        </div>
        <div>
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          {validationErrors.email && <p className="form-error">{validationErrors.email}</p>}
        </div>
        <div>
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          {validationErrors.password && <p className="form-error">{validationErrors.password}</p>}
        </div>
        <button className="button button--primary" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      
      <div>
        <p className="form-footer">
          Have an account? <Link className="text-link" to="/">Login</Link>
        </p>
      </div>
    </div>
    
  )
}

export default Register
