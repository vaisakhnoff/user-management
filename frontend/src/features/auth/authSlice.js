import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";


const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  status: 'idle',
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/login',credentials)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

// new thunk for registering users
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/register', formData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async(_,thunkAPI)=>{
       try {
        const response = await axiosInstance.get('/auth/me')
        return response.data
       } catch (error) {
         console.log(error)
        return thunkAPI.rejectWithValue('Session expired')
       }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        '/auth/profile',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return response.data
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue('Profile update failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = null
      state.isAuthenticated = false

      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.role = action.payload?.role || state.role
        state.isAuthenticated = true
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Session expired'
        state.user = null
        state.token = null
        state.role = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('role')
      })

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true

        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('role', action.payload.user.role)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
         state.user = null
  state.role = null
  state.isAuthenticated = false
  localStorage.removeItem('token')
  localStorage.removeItem('role')
      })
      // registerUser cases mirror loginUser
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true

        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('role', action.payload.user.role)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.user = null
        state.role = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('role')
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
  state.user = action.payload
})

  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
