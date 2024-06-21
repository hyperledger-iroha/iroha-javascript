import Axios from 'axios'

const axios = Axios.create()

export function setBaseURL(url: string) {
  axios.defaults.baseURL = url
}

export async function startPeer({ genesis }: { genesis?: boolean } = {}) {
  await axios.post('/peer/start', null, { params: { genesis: genesis ?? true } })
}

export async function killPeer() {
  await axios.post('/peer/kill')
}
