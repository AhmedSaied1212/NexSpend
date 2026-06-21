const BASE_URL = "http://localhost:9999/api/v1";

const api = {
    get: (request) => {
        return fetch(`${BASE_URL}/${request}`, {
            credentials: "include"
        })
    },

    post: (request, credentials) => {
        return fetch(`${BASE_URL}/${request}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(credentials),
        })
    },

    put: (request, id, credentials) => {
        return fetch(`${BASE_URL}/${request}/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(credentials),
        })
    },

    delete: (request, id) => {
        return fetch(`${BASE_URL}/${request}/${id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        })
    },
};

export default api;