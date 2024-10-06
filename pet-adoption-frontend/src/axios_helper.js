import axios from 'axios';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

const cookies = new Cookies();

axios.defaults.baseURL="http://localhost:8080"
axios.defaults.headers.post["Content-Type"] = 'application/json'

export const request = (method, url, data) => {
  let headers = {};
  if (getAuthToken() !== undefined && getAuthToken() !== "undefined") {
      headers = {"Authorization": `Bearer ${getAuthToken()}`}
  }

  return axios({
      method: method,
      headers: headers,
      url: url,
      data: data
  });
};

export const clearCookies = () => {
  cookies.remove("user");
  cookies.remove("jwt_authorization");
}

export const getAuthToken = () => {
  return cookies.get("jwt_authorization");
};

export const setAuthenticatedUser = (user) => {
  const token = user.token
  const decoded = jwtDecode(token);

  cookies.set("jwt_authorization", token, {
    expires: new Date(decoded.exp * 1000)
  });

  cookies.set("userID", user.id, {
    expires:new Date(decoded.exp * 1000)
  })
}

export const getUserID = () => {
  return cookies.get("userID");
}

export const clearToken = () => {
  cookies.remove("jwt_authorixation");
};
