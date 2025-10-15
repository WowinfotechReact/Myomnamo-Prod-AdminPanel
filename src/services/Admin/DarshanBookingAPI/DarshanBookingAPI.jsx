import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const AddUpdateDarshanBookingAPI = async (params, id) => {
  let url = '';
  if (id) {
    url = `${Base_Url}/api/TempleDarshanBooking/GetTempleDarshanModel?TempleDarshanKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/TempleDarshanBooking/AddUpdateTempleDarshan`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetDarshanBookingModal = async (id, AppLangID) => {
  let url = '';

  if (AppLangID) {
    url = `${Base_Url}/api/TempleDarshanBooking/GetTempleDarshanModel?TempleDarshanKeyID=${id}&AppLangID=${AppLangID}`;
  } else {
    url = `${Base_Url}/api/TempleDarshanBooking/GetTempleDarshanModel?TempleDarshanKeyID=${id}`;
  }
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetDarshanBookingListAPI = async (params, id) => {
  let url = '';

  if (id) {
    url = `${Base_Url}/api/TempleDarshanBooking/GetTempleDarshanList?TempleDarshanKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/TempleDarshanBooking/GetTempleDarshanList`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const ChangeStatus = async (id, AppLangID) => {
  let url = '';
  if (AppLangID === null || AppLangID === undefined || AppLangID === '' || AppLangID === 0) {
    url = `${Base_Url}/api/TempleDarshanBooking/ChangeTempleDarshanStatus?TempleDarshanKeyID=${id}`;
  } else {
    url = `${Base_Url}/api/TempleDarshanBooking/ChangeTempleDarshanStatus?TempleDarshanKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetTimeSlotLookupList = async (templeDarshanID) => {
  let url = '';

  url = `${Base_Url}/api/TimeSlot/GetTimeSlotLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};
