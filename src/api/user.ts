import api from '@/api'

export const getUserIdByUsername = async (username: string) => {
  try {
    const res = await api.get(`/api/users/name/${username}`)
    return res.data.userId
  } catch (e) {
    console.log(e)
  }
}

export const getUsernameByUserId = async (userId: string) => {
  try {
    const res = await api.get(`/api/users/id/${userId}`)
    return res.data.username
  } catch (e) {
    console.log(e)
  }
}
