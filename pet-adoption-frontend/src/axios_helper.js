import axios from 'axios';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import Router from 'next/router';

const cookies = new Cookies();

axios.defaults.baseURL="http://localhost:8080"
axios.defaults.headers.post["Content-Type"] = 'application/json'

export const request = (method, url, data) => {
  let headers = {};
  if( (url !== "/login" && url !== "/register") && getAuthToken() === undefined ) {
    Router.push("/");
  }

  if (getAuthToken() !== undefined && getAuthToken() !== "undefined") {
    const cookie = cookies.get("jwt_authorization");
    if (cookie) {
      if( cookie.expires ) {
        const expirationDate = new Date(cookie.expires);
        const now = new Date();

        if( now > expirationDate ) {
          Router.push("/");
          
        }
      }
    }
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
  cookies.remove("jwt_authorization");
}

export const clearUser = () => {
  sessionStorage.removeItem("userID");
}

export const getAuthToken = () => {
  let token = cookies.get("jwt_authorization");
  return token;
};

export const setAuthenticatedUser = (user) => {
  const token = user.token
  const decoded = jwtDecode(token);

  cookies.set("jwt_authorization", token, {
    expires: new Date(decoded.exp * 1000)
  });

  sessionStorage.setItem("userID", user.id);
}

export const getUserID = () => {
  return sessionStorage.getItem("userID");;
}

export const clearToken = () => {
  cookies.remove("jwt_authorization");
};
