import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/Vendor`;

export const GetVendorList = async (params) => {
    const url = `${BaseURL}/GetVendorList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateVendor = async (params) => {
    const url = `${BaseURL}/AddUpdateVendor`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetVendorModel = async (id) => {
    let url = `${BaseURL}/GetVendorModel?VendorID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetVendorLookupList = async () => {
    let url = `${BaseURL}/GetVendorLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeVendorStatus = async (id) => {
    let url = `${BaseURL}/ChangeVendorStatus?VendorID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

export const ViewVendorDetails = async (id) => {
    let url = `${BaseURL}/ViewVendorDetails?VendorID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};