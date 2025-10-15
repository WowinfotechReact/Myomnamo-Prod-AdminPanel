import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/ProductStock`;

export const GetProductStockListByPurchaseID = async (params, id) => {
    const url = `${BaseURL}/GetProductStockListByPurchaseID?PurchaseID=${id}`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};
export const GetProductStockListByWareHouseID = async (params, id, productStockID) => {
    const url = `${BaseURL}/GetProductStockListByWareHouseID?WarehouseID=${id}&PRODUCT_ID=${productStockID}`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateProductStock = async (params) => {
    const url = `${BaseURL}/AddUpdateProductStock`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetProductStockModel = async (id) => {
    let url = `${BaseURL}/GetProductStockModel?ProductStockID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetRawMaterialProductLookupList = async () => {
    let url = `${BaseURL}/GetRawMaterialProductLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeProductStockStatus = async (id) => {
    let url = `${BaseURL}/ChangeProductStockStatus?ProductStockID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

