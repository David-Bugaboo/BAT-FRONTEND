import axios from "axios";


export const api = axios.create({
    baseURL:"https://bat-prod-api-bf12b0d555f9.herokuapp.com/api/",
    timeout:"10000"
})