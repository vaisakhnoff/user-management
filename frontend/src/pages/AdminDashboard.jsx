import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, fetchUsers, updateUser } from '../features/users/usersSlice'
import LogoutButton from '../components/LogoutButton'
import { useNavigate } from 'react-router-dom'


const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { list } = useSelector((state) => state.users)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const { user: loggedInUser } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    dispatch(fetchUsers(e.target.value))
  }

  return (
    <div className="page page--admin">
      <div className="topbar">
        <div className="brand">Admin</div>
        <div className="top-actions">
          <button className="button" onClick={() => navigate('/home')}>Back to Home</button>
          <LogoutButton />
        </div>
      </div>

      <div className="card">
        <h2 className="page-title">Admin Dashboard</h2>

        <input
          className="input admin-search"
          placeholder="Search users"
          value={search}
          onChange={handleSearch}
        />

        <ul className="admin-list">
          {list.map((user) => (
            <li className="admin-item" key={user._id}>
              <input
                className="input admin-name"
                value={user.name}
                onChange={(e) =>
                  dispatch(
                    updateUser({
                      id: user._id,
                      data: { name: e.target.value },
                    })
                  )
                }
              />

              <select
                className="select admin-role"
                value={user.role}
                disabled={loggedInUser._id === user._id}
                onChange={(e) =>
                  dispatch(
                    updateUser({
                      id: user._id,
                      data: { role: e.target.value },
                    })
                  )
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>


              {loggedInUser._id !== user._id && (
                <button
                  className="button button--danger admin-delete"
                  onClick={() => dispatch(deleteUser(user._id))}
                >
                  Delete
                </button>
              )}
            </li>
          ))}

        </ul>
      </div>
    </div>
  )
}


export default AdminDashboard
