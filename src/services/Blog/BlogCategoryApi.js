import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

const blogCategoryBaseUrl = `${Base_Url}/api/BlogCategory`;



export const GetBlogCategoryList = async (params, BlogCategoryKeyID) => {
  let url = '';
  if (BlogCategoryKeyID === null || BlogCategoryKeyID === undefined || BlogCategoryKeyID === '') {
    url = `${blogCategoryBaseUrl}/GetBlogCategoryList`;
  } else {
    url = `${blogCategoryBaseUrl}/GetBlogCategoryList?BlogCategoryKeyID=${BlogCategoryKeyID}`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateBlogCategory = async (params) => {
    const url = `${blogCategoryBaseUrl}/AddUpdateBlogCategory`;
    const res = await postApiWithAuthenticated(url, params);
    return res;
};




export const GetBlogCategoryModel = async (id, AppLangID) => {
    let url = ""
    if (AppLangID == null || AppLangID === undefined || AppLangID === "") {
        url = `${blogCategoryBaseUrl}/GetBlogCategoryModel?BlogCategoryKeyID=${id}`;
    } else {
        url = `${blogCategoryBaseUrl}/GetBlogCategoryModel?BlogCategoryKeyID=${id}&AppLangID=${AppLangID}`;
    }


    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetBlogCategoryLookupList = async () => {
    let url = `${blogCategoryBaseUrl}/GetBlogCategoryLookupList`;
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ChangeBlogCategoryStatus = async (id, appLangID) => {
    // If `id` already contains the full URL, just use it directly
    let url;

    if (id.startsWith("http")) {
        // Already a full URL
        url = id;
    } else {
        // Build from base url + params
        url = `${blogCategoryBaseUrl}/ChangeBlogCategoryStatus?BlogCategoryKeyID=${id}`;
        if (appLangID) {
            url += `&AppLangID=${appLangID}`;
        }
    }

    const res = await getListWithAuthenticated(url);
    return res;
};


