import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/UploadCloudflareImage`;


export const UploadImage = async (params) => {
    const url = `${BaseURL}/UploadImage`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};


