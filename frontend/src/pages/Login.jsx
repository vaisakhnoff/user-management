import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';



const Login = ()=>{
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const { isAuthenticated, status, error, role } = useSelector(
    (state) => state.auth
  )

    const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

    const [validationErrors, setValidationErrors] = useState({})

   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setValidationErrors({ ...validationErrors, [e.target.name]: '' })
  }

    const validateForm = () => {
    const errors = {}
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    return errors
  }

    const handleSubmit = (e) => {
    e.preventDefault()
    const errors = validateForm()
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setValidationErrors({})
    dispatch(loginUser(formData))
  }

    useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') navigate('/admin')
      else navigate('/home')
    }
  }, [isAuthenticated, role, navigate])

  return (
    <div className="page page--auth">
        <h2 className="page-title">Login</h2>

        <form className="form" onSubmit={handleSubmit}>
            <div>
              <input
              className="input"
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange} />
              {validationErrors.email && <p className="form-error">{validationErrors.email}</p>}
            </div>

            <div>
              <input
              className="input"
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
               />
              {validationErrors.password && <p className="form-error">{validationErrors.password}</p>}
            </div>

             <button className="button button--primary" type="submit" disabled={status==='loading'}>
                {status==='loading' ? "Logging in..." : "Login"}
             </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        <p className="form-footer">
          Don't have an account? <Link className="text-link" to="/register">Register</Link>
        </p>
    </div>
  )
}

export default Login 
