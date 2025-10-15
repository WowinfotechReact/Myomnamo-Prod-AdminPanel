import { Base_Url } from 'component/Base-Url/BaseUrl';
import { getListWithAuthenticated, postApiWithAuthenticated } from 'services/ApiMethod/ApiMethod';

export const GetUserWalletList = async (params) => {
  let url = '';
  url = `${Base_Url}/api/UserWallet/GetUserWalletList`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const AddUpdateUserWalletAPI = async (params) => {
  let url = '';
  url = `${Base_Url}/api/UserWallet/AddUpdateUserWalletAmount`;

  const res = await postApiWithAuthenticated(url, params);
  return res;
};

// export const GetUserWalletModalAPI = async (productCatKeyID) => {
//   let url = '';
//   url = `${Base_Url}/api/ProductCategory/GetProductCategoryModel?ProductCatKeyID=${productCatKeyID}`;

//   const res = await getListWithAuthenticated(url);
//   return res;
// };

export const GetUserLookupList = async (AppLangID) => {
  let url = '';
  url = `${Base_Url}/api/User/GetUserLookupList`;

  const res = await getListWithAuthenticated(url);
  return res;
};
