import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 600000
});

const header = {
    'Content-Type': 'application/json'
}

const headerNew = {
    'Content-Type': 'text/csv'
}

const request = (method, url, data) => {
    return new Promise((resolve, reject) => {
        (() => {
            if (method === "get") {
                return instance.request({
                    url,
                    params: data,
                    headers: url !== null && url.includes("digitaloceanspaces.com") ? headerNew : header
                });
            } else {
                return instance.request({
                    url,
                    method,
                    data,
                    headers: url !== null && url.includes("digitaloceanspaces.com") ? headerNew : header
                });
            }
        })()
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err.response);
            });
    });
};

export default {
    get: (endpoint, data) => {
        return request('get', endpoint, data);
    },
    post: (endpoint, data) => {
        return request('post', endpoint, data);
    },
    put: (endpoint, data) => {
        return request('put', endpoint, data);
    },
    del: (endpoint, data) => {
        return request('delete', endpoint, data);
    },
    patch: (endpoint, data) => {
        return request('patch', endpoint, data);
    },
};