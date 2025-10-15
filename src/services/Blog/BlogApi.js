import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const blogBaseUrl = `${Base_Url}/api/Blog`;



export const GetBlogList = async (params, BlogKeyID) => {
  let url = '';
  if (BlogKeyID === null || BlogKeyID === undefined || BlogKeyID === '') {
    url = `${blogBaseUrl}/GetBlogList`;
  } else {
    url = `${blogBaseUrl}/GetBlogList?BlogKeyID=${BlogKeyID}`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateBlog = async (params) => {
    const url = `${blogBaseUrl}/AddUpdateBlog`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};


export const GetBlogModel = async (id, AppLangID) => {
    let url = ""
    if (AppLangID == null || AppLangID === undefined || AppLangID === "") {
        url = `${blogBaseUrl}/GetBlogModel?BlogKeyID=${id}`;
    } else {
        url = `${blogBaseUrl}/GetBlogModel?BlogKeyID=${id}&AppLangID=${AppLangID}`;
    }


    const res = await getListWithAuthenticated(url);
    return res;
};




export const ChangeBlogStatus = async (id, appLangID) => {
    // If `id` already contains the full URL, just use it directly
    let url;

    if (id.startsWith("http")) {
        // Already a full URL
        url = id;
    } else {
        // Build from base url + params
        url = `${blogBaseUrl}/ChangeBlogStatus?BlogKeyID=${id}`;
        if (appLangID) {
            url += `&AppLangID=${appLangID}`;
        }
    }

    const res = await getListWithAuthenticated(url);
    return res;
};
