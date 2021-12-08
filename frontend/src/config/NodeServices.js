import axios from 'axios'

// Node Server URL
const MAIN_URL = "http://localhost:8899/api"

//token
const token = sessionStorage.getItem('_token')

//Node Server Request and Response Functions

export function addUser(data){
    return axios.post(`${MAIN_URL}/register`,data)
}

export function loginuser(data){
    return axios.post(`${MAIN_URL}/login`,data)
}

export function fetchProducts(){
    return axios.get(`${MAIN_URL}/productsdata`,{headers:{"Authorization":`Bearer ${token}`}})
}

export function addToCart(data){
    return axios.post(`${MAIN_URL}/addcart`,data)
}

export function tokenAuthenticate(){
    return axios.get(`${MAIN_URL}/checktoken`,{headers:{"Authorization":`Bearer ${token}`}})
}

export function fetchuser(data){
    return axios.post(`${MAIN_URL}/fetchuser`,data)
}

export function addcard(data){
    return axios.post(`${MAIN_URL}/addcard`,data)
}

export function placeorder(data){
    return axios.post(`${MAIN_URL}/orderplace`,data)
}

export function deleteuser(data){
    return axios.post(`${MAIN_URL}/deleteuser`,data)
}