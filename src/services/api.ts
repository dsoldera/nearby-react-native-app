import axios from "axios"

export const api = axios.create({
  baseURL: "http://192.168.15.198:3333",
  withCredentials: true,
  timeout: 700,
})