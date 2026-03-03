import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'
import Profile from './Profile'

const Home = () => {
  const { user } = useSelector((state) => state.auth)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="page page--home">
      <header className="topbar">
        <div className="brand">UserMgmt</div>
        <div className="top-actions">
          <button className="button" onClick={() => setShowProfile(true)}>
            Profile
          </button>
          {user?.role === 'admin' && (
            <button className="button button--primary" onClick={() => navigate('/admin')}>
              Admin Dashboard
            </button>
          )}
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard">
        <div className="card welcome-card">
          {user?.profileImage && (
            <div className="profile-image-container">
              <img src={`http://localhost:5000${user.profileImage}`} alt="profile" className="profile-image" />
            </div>
          )}
          <h1 className="welcome">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
                      <h1>Your email id : {user.email}</h1>

          <p className="muted">Manage your account, view users (if admin), and update your profile.</p>
          <div className="card-actions">
            <button className="button button--primary" onClick={() => setShowProfile(true)}>
              Edit Profile
            </button>
            {user?.role === 'admin' && (
              <button className="button" onClick={() => navigate('/admin')}>
                Go to Admin
              </button>
            )}
          </div>
        </div>
      </main>

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </div>
  )
}

export default Home
