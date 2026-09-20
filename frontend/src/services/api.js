import axios from "axios";

const api = axios.create({
    baseURL: "https://b2b-rfq-marketplace-o5oa.onrender.com/api"
});

export default api;