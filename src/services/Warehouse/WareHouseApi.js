import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const WareHouseBaseUrl = `${Base_Url}/api/WareHouse`;

export const GetWareHouseList = async (params) => {
    const url = `${WareHouseBaseUrl}/GetWareHouseList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateWareHouse = async (params) => {
    const url = `${WareHouseBaseUrl}/AddUpdateWareHouse`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetWareHouseModel = async (id) => {
    let url = `${WareHouseBaseUrl}/GetWareHouseModel?WarehouseKeyID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetWareHouseLookupList = async () => {
    let url = `${WareHouseBaseUrl}/GetWareHouseLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeWareHouseStatus = async (id) => {
    let url = `${WareHouseBaseUrl}/ChangeWareHouseStatus?WarehouseKeyID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

export const ViewVendorDetails = async (id) => {
    let url = `${WareHouseBaseUrl}/ViewVendorDetails?VendorID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};