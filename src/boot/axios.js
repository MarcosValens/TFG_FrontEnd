import Vue from 'vue';
import axios from 'axios';

export default async ({ Vue, router }) => {
    axios.interceptors.request.use(function (config) {
        if (config.url.includes("login")) return config;
        config.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
        config.headers["X-Refresh-Token"] = localStorage.getItem("refresh-token");
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
        if ("access-token" in response.headers) {
            localStorage.setItem("token", response.headers["access-token"])
        }
        return response;
    }, function (error) {
        const isNotLoginRoute = !router.currentRoute.path.includes("login");
        if (error.response.status === 401 && isNotLoginRoute) {
            router.push("/login");
        }
        return Promise.reject(error);
    });
}

Vue.prototype.$axios = axios;
