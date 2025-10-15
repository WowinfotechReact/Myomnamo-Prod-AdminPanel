import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const BaseUrl = `${Base_Url}/api/`;

export const GetTimeSlotList = async (params, StateKeyID) => {
  let url = '';
  if (StateKeyID === null || StateKeyID === undefined || StateKeyID === '') {
    url = `${BaseUrl}TimeSlot/GetTimeSlotList?TimeSlotKeyID`;
  } else {
    url = `${BaseUrl}TimeSlot/GetTimeSlotList?TimeSlotKeyID=${StateKeyID}`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateTimeSlot = async (params) => {
  const url = `${BaseUrl}TimeSlot/AddUpdateTimeSlot?TimeSlotKeyID`; //TODO:add endpoint
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const GetTimeSlotCategoryModel = async (id, AppLangID) => {
  let url = '';
  if (AppLangID == null || AppLangID === undefined || AppLangID === '') {
    url = `${BaseUrl}TimeSlot/GetTimeSlotModel?TimeSlotKeyID=${id}`;
  } else {
    url = `${BaseUrl}TimeSlot/GetTimeSlotModel?TimeSlotKeyID=${id}&AppLangID=${AppLangID}`;
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeTimeSlotStatus = async (id, appLangID) => {
  // If `id` already contains the full URL, just use it directly
  let url;

  if (id.startsWith('http')) {
    // Already a full URL
    url = id;
  } else {
    // Build from base url + params
    url = `${BaseUrl}TimeSlot/ChangeTimeSlotStatus?TimeSlotKeyID=${id}`;
    if (appLangID) {
      url += `&AppLangID=${appLangID}`;
    }
  }

  const res = await getListWithAuthenticated(url);
  return res;
};
