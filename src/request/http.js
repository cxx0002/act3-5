import axios from "axios";
// import store from '../store'
// import {host,host2} from '../const'
// import router from "../router"
// import { Message } from 'view-design'
axios.defaults.baseURL = 'http://newtestuser.smaoxs.com';
axios.default.time = 3000;
// const token = localStorage.getItem("header");
// axios.defaults.headers={ "x-user-token": token};
// axios.defaults.headers.Authorization=token;
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, { headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}
