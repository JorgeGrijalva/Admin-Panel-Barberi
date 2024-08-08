import axios from "axios";
import {api_url_admin, api_url} from "../configs/app-global";


export const AxiosObject = async (type = "token") => {
    return axios.create(
        {
            baseURL: type === 'token' ? api_url_admin : api_url,
            timeout: 10000,
        }
    );
}
