export const CalenderFilterEnum = {
  All: 0,
  This_Week: 1,
  Last_Week: 2,
  This_Month: 3,
  Last_Month: 4,
  This_Quarter: 5,
  Last_Quarter: 6,
  This_6_Months: 7,
  Last_6_Months: 8,
  This_Year: 9,
  Last_Year: 10,
  Custom_Date_Range: 11,
  Today: 12
};

export const RoleTypeList = {
  SuperAdmin: 1,
  Admin: 2,
  Sales: 3,
  Technician: 4
};

export const itemTypeLookupList = [
  { value: 1, label: 'Raw Material' },
  { value: 2, label: 'Finished Goods' }
];

export const PanditTypeLookupList = [
  { value: 1, label: 'Pandit' },
  { value: 2, label: 'Daily Pandit' }
];


export const pujaServiceID = {
  Puja: 1,
  SankalpPuja: 2,
  PanditPuja: 3,
  PujaAtTemple: 4
};

export const pujaSubServiceID = {
  RemedyPuja: 1,
  HomamPuja: 2,
  SubscriptionRemedyPuja: 3,
  SubscriptionHomamPuja: 4,
  PanditPuja: 5,
  DailyPanditPuja: 6,
  PujaAtTemple: 7
};

export const daysList = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' }
];

export const ProductType = [
  { value: 1, label: 'Raw Material' },
  { value: 2, label: 'Finished Goods' }
];

export const NotificationTimeSlot = [
  { value: 1, label: '7 AM' },
  { value: 2, label: '8 PM' }
];

export const OrderStatus = [
  { value: 1, label: 'Pending' },
  { value: 2, label: 'Confirmed' },
  { value: 3, label: 'Completed' },
  { value: 4, label: 'Cancelled' },
  { value: 5, label: 'Rejected' }
];

export const OrderStatusEstore = [
  { value: 1, label: 'Pending' },
  { value: 2, label: 'Confirmed' },
  { value: 3, label: 'Processing' },
  { value: 4, label: 'Delivered' },
  { value: 5, label: 'Rejected' }
];
