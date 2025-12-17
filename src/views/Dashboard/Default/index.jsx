
import React, { useState, useContext, useEffect } from 'react';
import Select from 'react-select';
import dayjs from 'dayjs';
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardHeader, CardContent, Typography, Divider, LinearProgress } from '@mui/material';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SalesLineCard from 'views/Dashboard/card/SalesLineCard';
import SalesLineCardData from 'views/Dashboard/card/sale-chart-1';
import RevenuChartCard from 'views/Dashboard/card/RevenuChartCard';
import RevenuChartCardData from 'views/Dashboard/card/revenu-chart';
import ReportCard from './ReportCard';

import { gridSpacing } from 'config.js';
import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
import DescriptionTwoTone from '@mui/icons-material/DescriptionTwoTone';
import ThumbUpAltTwoTone from '@mui/icons-material/ThumbUpAltTwoTone';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';

import ThumbDownAltTwoTone from '@mui/icons-material/ThumbDownAltTwoTone';
import CalendarTodayTwoTone from '@mui/icons-material/CalendarTodayTwoTone'
import { CalenderFilter } from 'Middleware/Utils';
import { CalenderFilterEnum } from 'Middleware/Enum';
import { ConfigContext } from 'context/ConfigContext';

import { useNavigate } from 'react-router';

import Dailypandit from '../../../assets/images/Dailypandit.png'
import PanditBooking from '../../../assets/images/PanditBooking.png'
import Homam from '../../../assets/images/Homam.png'
import Puja from '../../../assets/images/Puja.png'
import RemedyPuja from '../../../assets/images/RemedyPuja.png'
import sankalpahomampuja from '../../../assets/images/sankalpahomampuja.png'
import sankalparemedypuja from '../../../assets/images/sankalparemedypuja.png'
import Estore from '../../../assets/images/E-store.png'
import {
  FaUsers,
  FaBlog,
  FaLandmark,
  FaUserShield,
  FaUserTie,
  FaUserCog,
  FaImages,
  FaTags,
} from "react-icons/fa";

import { AdminDashboardCounts, GetDashboardCounts } from 'services/Dashboard/DashboardApi';



// custom style
const FlatCardBlock = styled((props) => <Grid item sm={6} xs={12} {...props} />)(({ theme }) => ({
  padding: '25px 25px',
  borderLeft: '1px solid' + theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    borderLeft: 'none',
    borderBottom: '1px solid' + theme.palette.background.default
  },
  [theme.breakpoints.down('md')]: {
    borderBottom: '1px solid' + theme.palette.background.default
  }
}));

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();
  const { setLoader, user, setToDate, toDate, fromDate, setFromDate } = useContext(ConfigContext);
  const navigate = useNavigate()

  const [selectedOption, setSelectedOption] = useState(12);
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [dashboardCount, setDashboardCount] = useState([]);

  useEffect(() => {

    if (user.roleTypeID === 1) {
      DashboardCountData(dayjs(), dayjs());
      setToDate(dayjs())
      setFromDate(dayjs())
    } else {
      if (user.roleTypeID === 2) {
        DashboardInventoryCountData(dayjs(), dayjs());
      }
    }
  }, []);

  const handleCalenderFilterChange = async (selectedOption) => {
    setSelectedOption(selectedOption.value);
    setToDate(null);
    setFromDate(null);
    setShowDateFilters(false);

    let startDate;
    let endDate;

    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        startDate = null;
        endDate = null;
        break;
      case CalenderFilterEnum.This_Week:
        startDate = dayjs().startOf('week');
        endDate = dayjs().endOf('week');

        break;
      case CalenderFilterEnum.Last_Week:
        startDate = dayjs().subtract(1, 'week').startOf('week');
        endDate = dayjs().subtract(1, 'week').endOf('week');
        break;
      case CalenderFilterEnum.This_Month:
        startDate = dayjs().startOf('month');
        endDate = dayjs().endOf('month');
        break;
      case CalenderFilterEnum.Last_Month:
        startDate = dayjs().subtract(1, 'month').startOf('month');
        endDate = dayjs().subtract(1, 'month').endOf('month');
        break;
      case CalenderFilterEnum.This_Quarter:
        startDate = dayjs().startOf('quarter');
        endDate = dayjs().endOf('quarter');
        break;
      case CalenderFilterEnum.Last_Quarter:
        startDate = dayjs().subtract(1, 'quarter').startOf('quarter');
        endDate = dayjs().subtract(1, 'quarter').endOf('quarter');
        break;
      case CalenderFilterEnum.This_6_Months:
        startDate = dayjs().subtract(5, 'months').startOf('month');
        endDate = dayjs().endOf('month');
        break;
      case CalenderFilterEnum.Last_6_Months:
        startDate = dayjs().subtract(11, 'months').startOf('month');
        endDate = dayjs().subtract(6, 'months').endOf('month');
        break;
      case CalenderFilterEnum.This_Year:
        startDate = dayjs().startOf('year');
        endDate = dayjs().endOf('year');
        break;
      case CalenderFilterEnum.Last_Year:
        startDate = dayjs().subtract(1, 'year').startOf('year');
        endDate = dayjs().subtract(1, 'year').endOf('year');
        break;
      case CalenderFilterEnum.Today:
        startDate = dayjs();
        endDate = dayjs();
        break;
      case CalenderFilterEnum.Custom_Date_Range:
        setShowDateFilters(true);
        return; // Exit the function to avoid calling the API with undefined dates
      default:
        return;
    }
    setFromDate(startDate)
    setToDate(endDate)
    // Call the API with the calculated date range
    await DashboardCountData(startDate, endDate);
  };

  const handleToDateChange = (newValue) => {
    if (newValue && dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue);
      setToDate(newToDate);

      if (fromDate && newToDate.isBefore(fromDate)) {
        setFromDate(newToDate.subtract(1, 'day'));
      }
      DashboardCountData(fromDate, newToDate);
    } else {
      setToDate(null);
      DashboardCountData(fromDate, null);
    }
  };

  const handleFromDateChange = (newValue) => {
    if (newValue && dayjs(newValue).isValid()) {
      const newFromDate = dayjs(newValue);
      setFromDate(newFromDate);

      if (toDate && newFromDate.isAfter(toDate)) {
        setToDate(newFromDate.add(1, 'day'));
      } // Fixed: Pass fromDate first, then toDate to DashboardCountData
      DashboardCountData(newFromDate, toDate);
    } else {
      setFromDate(null);
      DashboardCountData(null, toDate);
    }
  };

  const handleClearDates = () => {
    setFromDate(null);
    setToDate(null);
  };

  const DashboardCountData = async (startDate, endDate, i) => {

    setLoader(true);
    setDashboardCount([]);
    try {
      const StartDate = startDate === null ? null : startDate.format('YYYY-MM-DD');
      const EndDate = endDate === null ? null : endDate.format('YYYY-MM-DD');

      // const response = await GetDashboardCounts({
      //   fromDate: StartDate,
      //   toDate: EndDate,
      //   adminID: user.admiN_ID,
      // });
      const response = await AdminDashboardCounts({
        fromDate: StartDate,
        toDate: EndDate,
        adminID: user.admiN_ID,
      });


      if (response?.data?.statusCode === 200) {
        setLoader(false);

        const DashboardNumb = response?.data?.responseData;
        setDashboardCount(DashboardNumb);

      } else {
        setLoader(false);
        if (startDate !== undefined && endDate !== undefined) {
        }
        setErrorMessage(response?.data?.errorMessage);
        setLoader(false);
      }



    } catch (error) {
      setLoader(false);
      console.log(error);
      if (startDate !== undefined && endDate !== undefined) {
        setLoader(false);
      }
    }
  };

  const DashboardInventoryCountData = async (startDate, endDate, i) => {

    setLoader(true);
    setDashboardCount([]);
    try {
      const StartDate = startDate === null ? null : startDate.format('YYYY-MM-DD');
      const EndDate = endDate === null ? null : endDate.format('YYYY-MM-DD');

      const response = await GetDashboardCounts({
        fromDate: StartDate,
        toDate: EndDate,
        adminID: user.admiN_ID,
      });


      if (response?.data?.statusCode === 200) {
        setLoader(false);

        const DashboardNumb = response?.data?.responseData;
        setDashboardCount(DashboardNumb);

      } else {
        setLoader(false);
        if (startDate !== undefined && endDate !== undefined) {
        }
        setErrorMessage(response?.data?.errorMessage);
        setLoader(false);
      }



    } catch (error) {
      setLoader(false);
      console.log(error);
      if (startDate !== undefined && endDate !== undefined) {
        setLoader(false);
      }
    }
  };
  const dashboardCards = [
    // Pandit Bookings
    {
      id: 1,
      title: "Pandit Bookings",
      bg: "#f9fff8",

      items: [
        {
          icon: PanditBooking,
          label: "Pandit Bookings",
          value: dashboardCount?.subServicesOrderCount?.panditPujaCount ?? 0,
          route: '/pandit-puja-booking'
        },
        {
          icon: Dailypandit,
          label: "Daily Pandit Bookings",
          value: dashboardCount?.subServicesOrderCount?.dailyPanditPujaCount ?? 0,
          route: '/daily-pandit-puja-booking'
        }

      ],
    },
    // "Pujas Bookings"
    {
      id: 2,
      title: "Pujas Bookings",
      bg: "#f8f9ff",
      items: [
        {
          icon: RemedyPuja,
          label: "Remedy Puja",
          value: dashboardCount?.subServicesOrderCount?.remedyPujaCount ?? 0,
          route: '/remedy-puja-booking'
        },
        {
          icon: Homam,
          label: "Homam Puja",
          value: dashboardCount?.subServicesOrderCount?.homamPujaCount ?? 0,
          route: '/homam-booking'
        },
      ],
    },

    // "Sankalp Puja Bookings"
    {
      id: 3,
      title: "Sankalp Puja Bookings",
      bg: "#fffaf7",
      items: [
        {
          icon: sankalparemedypuja,
          label: "Subscription Remedy Puja",
          value: dashboardCount?.subServicesOrderCount?.subscriptionRemedyPujaCount ?? 0,
          route: '/subscription-puja-booking'
        },
        {
          icon: sankalpahomampuja,
          label: "Subscription Homam Puja",
          value: dashboardCount?.subServicesOrderCount?.subscriptionHomamPujaCount ?? 0,
          route: '/subscription-homam-booking'
        }

      ],
    },

    // E-commerce Orders
    {
      id: 4,
      title: "E-commerce Orders",
      bg: "#fffaf7",
      items: [
        {
          icon: Estore,
          label: "Product Orders",
          value: dashboardCount?.subServicesOrderCount?.productCount ?? 0,
          route: '/estore-bookings'
        },
        {
          icon: Estore,
          label: "Prasad Orders",
          value: dashboardCount?.subServicesOrderCount?.prasadCount ?? 0,
          route: '/prasad-bookings'
        }


      ],
    },
    // Puja At Temple Bookings
    {
      id: 5,
      title: "Puja At Temple Bookings",
      bg: "#fffaf7",
      items: [
        {
          icon: RemedyPuja,
          label: "Remedy Puja Bookings",
          value: dashboardCount?.subServicesOrderCount?.pujaAtTempleCount ?? 0,
          route: '/puja-at-temple-booking'
        },
        {
          icon: sankalparemedypuja,
          label: "Subscription Remedy Puja Bookings",
          value: dashboardCount?.subServicesOrderCount?.pujaAtTempleCount ?? 0,
          route: '/puja-at-temple-booking'
        },
        {
          icon: Homam,
          label: "Homam Puja Bookings",
          value: dashboardCount?.subServicesOrderCount?.pujaAtTempleCount ?? 0,
          route: '/puja-at-temple-booking'
        },

        {
          icon: sankalpahomampuja,
          label: "Subscription Homam Puja",
          value: dashboardCount?.subServicesOrderCount?.pujaAtTempleCount ?? 0,
          route: '/puja-at-temple-booking'
        }

      ],
    },

    // Pandit Master
    {
      id: 6,
      title: "Pandit Management",
      bg: "#f9fff8",

      items: [
        {
          icon: PanditBooking,
          label: "Pandit Pujas",
          value: dashboardCount?.subServicesCount?.panditPujaCount ?? 0,
          route: '/pandit-puja'
        },
        {
          icon: Dailypandit,
          label: "Daily Pandit Pujas",
          value: dashboardCount?.subServicesCount?.dailyPanditPujaCount ?? 0,
          route: '/daily-pandit-puja'
        }

      ],
    },
    // "Pujas Master"
    {
      id: 7,
      title: "Pujas Master",
      bg: "#f8f9ff",
      items: [
        {
          icon: RemedyPuja,
          label: "Remedy Puja",
          value: dashboardCount?.subServicesCount?.remedyPujaCount ?? 0,
          route: '/remedy-puja'
        },
        {
          icon: Homam,
          label: "Homam Puja",
          value: dashboardCount?.subServicesCount?.homamPujaCount ?? 0,
          route: '/homam-puja'
        },
      ],
    },

    // "Sankalp Puja Bookings"
    {
      id: 8,
      title: "Sankalp Puja Master",
      bg: "#fffaf7",
      items: [
        {
          icon: sankalparemedypuja,
          label: "Subscription Remedy Puja",
          value: dashboardCount?.subServicesCount?.subscriptionRemedyPujaCount ?? 0,
          route: '/subscription-puja'
        },
        {
          icon: sankalpahomampuja,
          label: "Subscription Homam Puja",
          value: dashboardCount?.subServicesCount?.subscriptionHomamPujaCount ?? 0,
          route: '/subscription-homam'
        }

      ],
    },

    // E-commerce Master
    {
      id: 9,
      title: "E-commerce Master",
      bg: "#fffaf7",
      items: [
        {
          icon: Estore,
          label: "Product Master",
          value: dashboardCount?.subServicesCount?.productCount ?? 0,
          route: '/estore-product'
        },
        {
          icon: Estore,
          label: "Prasad Master",
          value: dashboardCount?.subServicesCount?.prasadCount ?? 0,
          route: '/prasad-master'
        }


      ],
    },

    {
      id: 10,
      title: "Users Master",
      bg: "#fffaf7",
      items: [
        {
          icon: <FaUserShield size={28} color="#8f3246" />,
          label: "Total Admin",
          value: dashboardCount?.adminCount ?? 0,
          route: "/admin-master",
        },
        {
          icon: <FaUserCog size={28} color="#8f3246" />,
          label: "Total Temple Staff",
          value: dashboardCount?.myomnamoEmployeeCount ?? 0,
          route: "/employee-master",
        },
        {
          icon: <FaUserTie size={28} color="#8f3246" />,
          label: "Total Pandits",
          value: dashboardCount?.panditCount ?? 0,
          route: "/pandit-master",
        },
        {
          icon: <FaUsers size={28} color="#8f3246" />,
          label: "Users List",
          value: dashboardCount?.userCounts ?? 0,
          route: "/users",
        },

      ],
    },

    // "Master List"
    {
      id: 11,
      title: "Other Master Data",
      bg: "#fffaf7",
      items: [

        {
          icon: <FaLandmark size={28} color="#8f3246" />, // ✅ Temple alternative
          label: "Total Temples",
          value: dashboardCount?.templeCounts ?? 0,
          route: "/temples",
        },
        {
          icon: <FaImages size={28} color="#8f3246" />,
          label: "Total Banners",
          value: dashboardCount?.bannerCount ?? 0,
          route: "/banner",
        },
        {
          icon: <FaBlog size={28} color="#8f3246" />,
          label: "Total Blogs",
          value: dashboardCount?.subServicesCount?.blogCount ?? 0,
          route: "/blog",
        },

        {
          icon: <FaTags size={28} color="#8f3246" />,
          label: "Total Coupon Codes",
          value: dashboardCount?.couponCodeCount ?? 0,
          route: "/coupon-code",
        },

      ],
    },



  ];

  const dashboardInventoryCards = [

    {
      id: 1,
      title: "Vendors",
      bg: "#f9fff8",
      items: [
        {
          icon: PanditBooking,
          label: "Vendors",
          value: dashboardCount?.totalVendors ?? 0,
        }

      ],
    },
    {
      id: 2,
      title: "Total Raw Material",
      bg: "#f8f9ff",
      items: [
        {
          icon: RemedyPuja,
          label: "Total Raw Material",
          value: dashboardCount?.totalRawMaterial ?? 0,
        }
      ],
    },
    {
      id: 3,
      title: "Total Stock",
      bg: "#fffaf7",
      items: [
        {
          icon: sankalparemedypuja,
          label: "Total Stock Available",
          value: dashboardCount?.subServicesOrderCount?.subscriptionRemedyPujaCount ?? 0,
        }

      ],
    },
    {
      id: 4,
      title: "Total Purchase Order",
      bg: "#fffaf7",
      items: [
        {
          icon: Estore,
          label: "Total Purchase Order",
          value: dashboardCount?.totalPurchaseOrder ?? 0,
        }


      ],
    },
    {
      id: 5,
      title: "Total Finished Goods",
      bg: "#fffaf7",
      items: [
        {
          icon: RemedyPuja,
          label: "Total Finished Goods",
          value: dashboardCount?.totalFinishedGoods ?? 0,
        }

      ],
    },


  ];


  return (
    <div className="container py-2">
      <h3 className="fw-bold mb1">Dashboard</h3>

      <hr></hr>
      <div className='className="card border-1 shadow-lg rounded-4 p-3 h-100"'>

        <h5 className="fw-semibold mb-3 text-center">Bookings & Orders Summary </h5>
        <Grid sm={12} item className='mb-2' >
          <div
            style={{
              display: 'flex',
              gap: '112px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            {' '}
            <div>
              <Select
                options={CalenderFilter}

                value={CalenderFilter?.filter((v) => v?.value === selectedOption)}
                onChange={handleCalenderFilterChange}
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '320px',
                    minWidth: '320px'
                  })
                }}
              />
            </div>

            {showDateFilters && (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // flexWrap: 'wrap',

                }}
              >
                <DatePicker
                  className="date-picker-input text-nowrap  "
                  label="From Date"
                  value={fromDate ? fromDate.toDate() : null}
                  onChange={handleFromDateChange}
                  clearIcon={null}
                  maxDate={toDate ? dayjs(toDate).toDate() : null}
                  format='dd/MM/yyyy'
                />
                {/* DatePicker - To */}
                <DatePicker
                  minDate={fromDate ? dayjs(fromDate).toDate() : null}
                  className="date-picker-input text-nowrap"
                  label="To Date"
                  value={toDate ? toDate.toDate() : null}
                  onChange={handleToDateChange}
                  clearIcon={null}
                  format='dd/MM/yyyy'
                />
                <button className="btn btn-primary customBtn" onClick={handleClearDates}>
                  Clear
                </button>
              </div>
            )}
          </div>
        </Grid>
        <hr></hr>
        <div className="row g-3 mb-4">
          {dashboardCards
            .filter(card => card.id <= 5)
            .map((card, index) => (
              <div
                key={index}
                className={`${card.id === 5 ? 'col-lg-8' : card.id === 10 ? 'col-lg-12' : 'col-lg-4'} col-md-6 col-sm-12`}
              >
                <div
                  className="card border-0 shadow-sm rounded-4 p-3 h-100"
                  style={{ backgroundColor: card.bg }}
                >
                  <h6 className="fw-semibold mb-3">{card.title}</h6>

                  {/* Booking cards logic (same as your existing) */}
                  {card.id === 5 ? (
                    <div className="row g-2">
                      {card.items.map((item, i) => (
                        <div key={i} className="col-6">
                          <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 shadow-sm h-100">
                            <div className="d-flex align-items-center">
                              <img className="me-2 fs-5" width={35} height={40} src={item?.icon} />
                              <span style={{ fontSize: "14px" }}>{item.label}</span>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold fs-6">{item.value}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {card.items.map((item, i) => (
                        <div
                          key={i}
                          style={{ cursor: 'pointer' }}
                          className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 shadow-sm"
                          onClick={() => navigate(item?.route)}
                        >
                          <div className="d-flex align-items-center">
                            <img className="me-2 fs-5" width={35} height={40} src={item?.icon} />
                            <span>{item.label}</span>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold fs-6">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <hr className="my-4" />
      <div className='className="card border-1 shadow-lg rounded-4 p-3 h-100"'>

        <h5 className="fw-semibold mb-3 text-center">Master Data Overview</h5>
        <div className="row g-3">
          {dashboardCards
            .filter(card => card.id > 5)
            .map((card, index) => (
              <div
                key={index}
                className={`${(card.id === 5 || card.id === 10) ? 'col-lg-8' : card.id === 11 ? 'col-lg-12' : 'col-lg-4'} col-md-6 col-sm-12`}
              >
                <div
                  className="card border-0 shadow-sm rounded-4 p-3 h-100"
                  style={{ backgroundColor: card.bg }}
                >
                  <h6 className="fw-semibold mb-3">{card.title}</h6>

                  {/* Master list logic (same as your existing) */}
                  {card.id === 11 ? (
                    <div className="row g-2">
                      {card.items.map((item, i) => (
                        <div key={i} className="col-4" onClick={() => navigate(item?.route)} style={{ cursor: 'pointer' }}>
                          <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 shadow-sm h-100">
                            <div className="d-flex align-items-center">
                              <span className="mx-2">{item?.icon}</span>
                              <span style={{ fontSize: "14px" }}>{item.label}</span>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold fs-6">{item.value}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : card.id === 10 ? (
                    <div className="row g-2">
                      {card.items.map((item, i) => (
                        <div key={i} className="col-6" onClick={() => navigate(item?.route)} style={{ cursor: 'pointer' }}>
                          <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 shadow-sm h-100">
                            <div className="d-flex align-items-center">
                              <span className="mx-2">{item?.icon}</span>
                              <span style={{ fontSize: "14px" }}>{item.label}</span>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold fs-6">{item.value}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {card.items.map((item, i) => (
                        <div
                          key={i}
                          style={{ cursor: 'pointer' }}
                          className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 shadow-sm"
                          onClick={() => navigate(item?.route)}
                        >
                          <div className="d-flex align-items-center">
                            <img className="me-2 fs-5" width={35} height={40} src={item?.icon} />
                            <span>{item.label}</span>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold fs-6">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>


    </div>
  );
};

export default Default;
