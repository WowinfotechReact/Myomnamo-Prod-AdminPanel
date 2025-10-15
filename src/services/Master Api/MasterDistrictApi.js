import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const MasterDistrictBaseURI = `${Base_Url}/api/District`;

export const GetDistrictLookupList = async (StateID) => {
    let url = `${MasterDistrictBaseURI}/GetDistrictLookupList?StateID=${StateID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};
