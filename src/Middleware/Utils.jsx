// utils/debounce.js
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};
export const RechargeDropDown = [
  { value: 1, label: 'Post Expiry - Below 30 Days' },
  { value: 2, label: 'Post Expiry - Above 30 Days' },
  { value: 3, label: 'Pre Expiry - 30 Days To Expire' }
];
export const PujaTypeIDOption = [
  { value: 1, label: 'Online' },
  { value: 2, label: 'Offline' },
  { value: 3, label: 'Both' }
];

export const MisOptions = [
  { value: 1, label: 'IMEI' },
  { value: 2, label: 'Vehicle No' },
  { value: 3, label: 'SIM' },
  { value: 4, label: 'Offline' },
  { value: 5, label: 'Days to Expire' },
  { value: 6, label: 'Expired' }
];
export const MisTrackinOptions = [
  { value: 1, label: 'IMEI' },
  { value: 2, label: 'Vehicle No' },
  { value: 3, label: 'SIM' },
  { value: 4, label: 'Point Query' },
  { value: 5, label: 'Tracking Point Available ' },
  { value: 6, label: 'No Data' }
];

export const InstallationTypeID = [
  { value: 1, label: 'GPS' },
  { value: 2, label: 'GPS RTO' }
];

export const TemporaryDeviceInstalled = [
  { value: true, label: 'True' },
  { value: false, label: 'False' }
];

export const PaymentMode = [
  { value: 1, label: 'Cash' },
  { value: 2, label: 'Credit' },
  { value: 3, label: 'Account' }
];

export const LeadTypeNameList = [
  { value: 1, label: 'Hot' },
  { value: 2, label: 'Warm' },
  { value: 3, label: 'Cold' }
];

export const PaymentStatus = [
  { value: true, label: 'Paid' },
  { value: false, label: 'Un-Paid' }
];
export const TrackingId = [
  { value: 2, label: 'Trackin' },
  { value: 1, label: 'MiliTrack' }
];

export const installationMiliTrackDevice = [
  { value: 1, label: 'SVTS' },
  { value: 2, label: 'SVTS 2' },
  { value: 3, label: 'Vihaana' }
];
export const PaymentStatusList = [
  { value: 1, label: 'Paid' },
  { value: 2, label: 'Un-paid' }
];

export const InstallationTypeOption = [
  { value: 1, label: 'GPS' },
  { value: 2, label: 'GPS RTO' }
];
// export default { MisOptions, MisTrackinOptions };
export const CalenderFilter = [
  {
    value: 0,
    label: 'All'
  },
  {
    value: 1,
    label: 'This Week'
  },
  {
    value: 2,
    label: 'Last Week'
  },
  {
    value: 3,
    label: 'This Month'
  },
  {
    value: 4,
    label: 'Last Month'
  },
  {
    value: 5,
    label: 'This Quarter'
  },
  {
    value: 6,
    label: 'Last Quarter'
  },
  {
    value: 7,
    label: 'This 6 Months'
  },
  {
    value: 8,
    label: 'Last 6 Months'
  },
  {
    value: 9,
    label: 'This Year'
  },
  {
    value: 10,
    label: 'Last Year'
  },
  {
    value: 11,
    label: 'Custom Date Range'
  }
];

export const GovernmentPortalDataOption = [
  { value: 1, label: 'Mahakhanij' },
  { value: 2, label: 'CGM' },
  { value: 3, label: 'CGM GPS Data Report' },
  { value: 4, label: 'Transync' },
  { value: 5, label: 'Transync GPS Data Report' }
];

export const pendingComplaintTabOption = [
  { value: 2, label: 'Sales Return' },
  { value: 3, label: 'Completed' }
];

export const CouponTypeOptions = [
  { value: 1, label: 'Percentage' },
  { value: 2, label: 'Amount' }
];

export const ApplicableForOption = [
  { value: 1, label: 'All Users' },
  { value: 2, label: 'User Wise' },
  { value: 3, label: 'Service Wise' }
];

export const MonthWiseUtilList = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];
