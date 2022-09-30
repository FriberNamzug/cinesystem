import axios from "axios";

export const AxiosConfig = () => axios.defaults.baseURL = import.meta.env.VITE_RUTA_API;
