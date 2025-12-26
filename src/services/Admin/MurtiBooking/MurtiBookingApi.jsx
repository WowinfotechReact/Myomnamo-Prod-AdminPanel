import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseURL = `${Base_Url}/api/MurtiBooking`;

export const GetMurtiBookingList = async (apiParam,BusinessKeyID) => {
    let url = `${BaseURL}/GetMurtiBookingList?BusinessKeyID=${BusinessKeyID}`;
    const res = await postApiWithAuthenticated(url, apiParam);
    return res;
};

