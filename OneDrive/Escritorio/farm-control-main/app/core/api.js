import axios from "axios";

export const ADDRESS = "pollosdelcampo.uk";

const api = axios.create({
  baseURL: "https://" + ADDRESS,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;