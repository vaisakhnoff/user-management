import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { updateProfile, loadUser } from '../features/auth/authSlice'

const Profile = ({ onClose }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [name, setName] = useState(user?.name || '')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(user?.profileImage ? `http://localhost:5000${user.profileImage}` : null)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleImage = (file) => {
    setImage(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!name.trim()) {
      errors.name = 'Name is required'
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (image && !image.type.startsWith('image/')) {
      errors.image = 'Please upload a valid image file'
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
    const formData = new FormData()
    formData.append('name', name)
    if (image) formData.append('profileImage', image)

    dispatch(updateProfile(formData)).then(() => {
      dispatch(loadUser())
      onClose()
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h3 className="modal-title">Your Profile</h3>

        <div className="profile-grid">
          <div className="profile-preview">
            <div className="avatar-wrap">
              {preview ? (
                <img src={preview} alt="avatar" className="avatar" />
              ) : (
                <div className="avatar avatar--placeholder">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              )}
            </div>
          </div>

          <form className="form profile-form" onSubmit={handleSubmit}>
            <div>
              <input className="input" value={name} onChange={(e) => {
                setName(e.target.value)
                setValidationErrors({ ...validationErrors, name: '' })
              }} />
              {validationErrors.name && <p className="form-error">{validationErrors.name}</p>}
            </div>

            <div>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImage(e.target.files[0])
                  setValidationErrors({ ...validationErrors, image: '' })
                }}
              />
              {validationErrors.image && <p className="form-error">{validationErrors.image}</p>}
            </div>

            <div className="modal-actions">
              <button type="button" className="button button--ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="button button--primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
