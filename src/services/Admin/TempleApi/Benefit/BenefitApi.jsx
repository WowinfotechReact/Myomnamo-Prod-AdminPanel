import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/Benefit`;

export const GetBenefitList = async (params, BenefitKeyID) => {
    let url = BaseURL;
    if (BenefitKeyID !== null && BenefitKeyID !== undefined && BenefitKeyID !== "") {
        url = `${BaseURL}/GetBenefitList?BenefitKeyID=${BenefitKeyID}`;
    } else {
        url = `${BaseURL}/GetBenefitList`;
    }

    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateBenefit = async (params) => {
    const url = `${BaseURL}/AddUpdateBenefit`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetBenefitModel = async (id, AppLangID) => {
    let url = BaseURL;
    if (AppLangID !== null && AppLangID !== undefined && AppLangID !== "") {
        url = `${BaseURL}/GetBenefitModel?BenefitKeyID=${id}&AppLangID=${AppLangID}`;
    } else {
        url = `${BaseURL}/GetBenefitModel?BenefitKeyID=${id}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetBenefitLookupList = async (TempleID) => {
    let url = `${BaseURL}`;
    if (TempleID === null || TempleID === undefined || TempleID === "") {
        url = `${BaseURL}/GetBenefitLookupList`;
    } else {
        url = `${BaseURL}/GetBenefitLookupList?TempleID=${TempleID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeBenefitStatus = async (id, AppLangID) => {
    let url = BaseURL;
    if (AppLangID !== null && AppLangID !== undefined && AppLangID !== "") {
        url = `${BaseURL}/ChangeBenefitStatus?BenefitKeyID=${id}&AppLangID=${AppLangID}`;
    } else {
        url = `${BaseURL}/ChangeBenefitStatus?BenefitKeyID=${id}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};

