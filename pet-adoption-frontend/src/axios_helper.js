import axios from 'axios';

axios.defaults.baseURL="http://localhost:8080"
axios.defaults.headers.post["Content-Type"] = 'application/json'

export const request = (method, url, data) => {
  let headers = {};
  {/*if (getAuthToken() !== undefined && getAuthToken() !== "undefined") {
      headers = {"Authorization": `Bearer ${getAuthToken()}`}
  } */}

  return axios({
      method: method,
      headers: headers,
      url: url,
      data: data
  });
};

export const setLoggedInEmail = (email) => {
  localStorage.setItem("email", email)
}

export const getLoggedInEmail = () => {
  return localStorage.getItem("email");
}