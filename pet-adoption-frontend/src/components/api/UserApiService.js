import { apiClient } from "./ApiClient";

export const retrieveUser = 
    (id) => apiClient.get(`/users/${id}`)