import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const LeadBaseURL = `${Base_Url}/Lead`;

export const GetLeadDataList = async (params) => {
    const url = `${LeadBaseURL}/GetLeadList`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const AddUpdateLeadApi = async (params) => {
    const url = `${LeadBaseURL}/AddUpdateLead`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};
export const MultipleLeadAssignToSalesman = async (params) => {
    const url = `${LeadBaseURL}/MultipleLeadAssignToSalesman`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};

export const GetLeadModel = async (id) => {
    let url = `${LeadBaseURL}/GetLeadModel?LeadKeyID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetVehicleLookupList = async (customerID, installationKeyID) => {
    let url = `${LeadBaseURL}/GetVehicleLookupList?LeadKeyID=&CustomerKeyID=${customerID}`;

    // Only add InstallationKeyID if it's not null/undefined/empty
    if (installationKeyID) {
        url += `&InstallationKeyID=${installationKeyID}`;
    }

    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetLeadLogList = async (id) => {
    let url = `${LeadBaseURL}/GetLeadLogList?LeadKeyID=${id}`;

    const res = await getListWithAuthenticated(url);
    return res;
};

export const AssignTechnicianApi = async (params) => {
    const url = `${LeadBaseURL}/AssignLeadSalesman`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};