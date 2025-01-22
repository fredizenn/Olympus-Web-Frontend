import { browser } from "$app/environment";
import axios from "axios";


const client = axios.create({
    baseURL: 'https://hostel-management-api-wxr6.onrender.com/api/',
    timeout: 30000
})

if (browser) {
    const token = localStorage?.getItem('x');
    if(token) {
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
} 

client.interceptors.response.use(
    (config) => {
        const token = localStorage.getItem('x');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
)

export async function createRestClient() {
    const token = localStorage?.getItem('x');

    const client = axios.create({
        baseURL: 'https://hostel-management-api-wxr6.onrender.com/api/',
        timeout: 30000,
    });

    if (token) {
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    client.interceptors.response.use(
        (config) => {
            const dynamicToken = localStorage.getItem('x');
            if (dynamicToken) {
                config.headers['Authorization'] = `Bearer ${dynamicToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return client;
}


export { client }