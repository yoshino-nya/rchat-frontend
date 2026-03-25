import axios from 'axios'

export const getUserIdByUsername = async (username: string) => {
  try {
    const res = await axios.get(`/api/users/name/${username}`)
    return res.data.userId
  } catch (e) {
    console.log(e)
  }
}

export const getUsernameByUserId = async (userId: string) => {
  try {
    const res = await axios.get(`/api/users/id/${userId}`)
    return res.data.username
  } catch (e) {
    console.log(e)
  }
}
