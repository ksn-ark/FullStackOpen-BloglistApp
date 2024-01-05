import axios from "axios";
const baseUrl = "/api/login";

const login = async (credentials) => {
  const repsonse = await axios.post(baseUrl, credentials);
  return repsonse.data;
};

export default { login };
