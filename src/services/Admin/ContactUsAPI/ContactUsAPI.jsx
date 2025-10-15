import { Base_Url } from 'component/Base-Url/BaseUrl';
import { postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetContactUsList = async (params, ProductCatKeyID) => {
  let url = '';
  if (ProductCatKeyID) {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryList?ProductCatKeyID=${ProductCatKeyID}`;
  } else {
    url = `${Base_Url}/api/ProductCategory/GetProductCategoryList`;
  }

  const res = await postApiWithAuthenticated(url, params);
  return res;
};
