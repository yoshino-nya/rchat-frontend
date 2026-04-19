import axios from 'axios'

export async function getSessionId(user_id1: number, user_id2: number) {
  let res = await axios.post(`/api/sessions/private`, {
    user_id1,
    user_id2,
  })
  console.log(res)
  return res.data.data
}
