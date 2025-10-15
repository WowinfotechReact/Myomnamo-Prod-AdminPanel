import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/TempleByLanguage`;

export const GetTempleByLanguageList = async (params) => {
    const url = `${BaseURL}/GetTempleByLanguageList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateTempleByLanguage = async (params) => {
    const url = `${BaseURL}/AddUpdateTempleByLanguage`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetTempleByLanguageModel = async (id) => {
    let url = `${BaseURL}/GetTempleByLanguageModel?TempleLanID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

export const ChangeTempleByLanguageStatus = async (id) => {
    let url = `${BaseURL}/ChangeTempleByLanguageStatus?TempleLanID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

