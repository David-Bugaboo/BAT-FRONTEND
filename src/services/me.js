import { api } from "./API"


const me = async ()=>{

    const {data} = await api.get("/me")
    
    return data.me
}
export default me