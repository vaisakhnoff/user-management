import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../services/axiosInstance'

// Fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (search = '') => {
    const res = await axiosInstance.get(`/admin/users?search=${search}`)
    return res.data
  }
)

// Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id) => {
    await axiosInstance.delete(`/admin/users/${id}`)
    return id
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }) => {
    const res = await axiosInstance.put(
      `/admin/users/${id}`,
      data
    )
    return res.data
  }
)


const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (user) => user._id !== action.payload
        )
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.list = state.list.map((user) =>
          user._id === action.payload._id
      ? action.payload
      : user
  )
})


  },
})

export default usersSlice.reducer
