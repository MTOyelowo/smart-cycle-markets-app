import axios from "axios";

export const baseURL = "http://192.168.0.143:8000";

const client = axios.create({ baseURL })

export default client;