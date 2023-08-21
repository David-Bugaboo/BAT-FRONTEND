import { api } from "./API"


const markWatched = async (video, user) =>{
    const response = await api.patch(`/users/${user}/videos`,{"video":video})
    return response
}

export default markWatched