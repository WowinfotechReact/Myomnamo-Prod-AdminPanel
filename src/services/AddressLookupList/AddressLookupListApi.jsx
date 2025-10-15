
import { Base_Url } from "component/Base-Url/BaseUrl";
import { getListWithAuthenticated } from "services/ApiMethod/ApiMethod";



export const StateLookupList = async (countryID) => {
    const url = `${Base_Url}/State?CountryID=${countryID}`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const CityLookupList = async (cityID) => {
    let url;
    if (cityID === null) {
        url = `${Base_Url}/City?StateID=`;
    } else {
        url = `${Base_Url}/City?StateID=${cityID}`;
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
export const CountryLookupList = async () => {
    const url = `${Base_Url}/Country`;
    const res = await getListWithAuthenticated(url);
    return res;
};