import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterStateBaseURI = `${Base_Url}/api/State`;

export const GetStateLookupList = async () => {
    let url = `${MasterStateBaseURI}/GetStateLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
