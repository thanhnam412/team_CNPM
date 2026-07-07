import axios from "axios";

export const create_api = (baseURL: string = "/api/b") => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
    },
  });
};

const api = create_api();

export default api;
