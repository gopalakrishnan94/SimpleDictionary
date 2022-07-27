import axios from 'axios'

export const HTTP = axios.create({
    baseURL: `https://api.dictionaryapi.dev/`,
    headers: {
        "Content-Type": "application/json"
    }
})