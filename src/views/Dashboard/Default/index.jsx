
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { GetDashboardCounts } from 'services/Dashboard/DashboardApi';
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
  const { setLoader, user, companyID } = useContext(ConfigContext);
  const navigate = useNavigate()
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [dashboardCount, setDashboardCount] = useState([]);

  useEffect(() => {
    DashboardCountData(null, null);
  }, []);

  const handleCalenderFilterChange = async (selectedOption) => {
    setSelectedOption(selectedOption);
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
      case CalenderFilterEnum.Custom_Date_Range:
        setShowDateFilters(true);
        return; // Exit the function to avoid calling the API with undefined dates
      default:
        return;
    }
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

      const response = await GetDashboardCounts({
        fromDate: StartDate,
        toDate: EndDate,
        adminID: user.admiN_ID,
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const DashboardNumb = response?.data?.responseData?.data;
            setDashboardCount(DashboardNumb);
          }
        } else {
          setLoader(false);
          if (startDate !== undefined && endDate !== undefined) {
          }
          setErrorMessage(response?.data?.errorMessage);
          setLoader(false);
        }

        return response;
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      if (startDate !== undefined && endDate !== undefined) {
        setLoader(false);
      }
    }
  };

  const cardData =
    [
      {
        title: 'Total Vendors',
        count: dashboardCount?.totalVendors,
        Icons: BusinessIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a52444, #f4b722)'
      },
      {
        title: 'Total Raw Material',
        count: dashboardCount?.totalRawMaterial,
        Icons: CategoryIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a52480, #f4796b)'
      },
      {
        title: 'Total Stock Available',
        count: dashboardCount?.totalStockAvailable,
        Icons: InventoryIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a55444, #fbc2eb)'
      },
      {
        title: 'Total Purchase Orders',
        count: dashboardCount?.totalPurchaseOrder,
        Icons: ReceiptIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a52644, #f67280)'
      },
      {
        title: 'Total Finished Goods',
        count: dashboardCount?.totalFinishedGoods,
        Icons: ChecklistIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a52447, #f8cdda)'
      },
      {
        title: 'Total Customer Orders',
        count: dashboardCount?.totalCustomersOrder,
        Icons: AssignmentTurnedInIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a52444, #fdc830)'
      },
      {
        title: 'Pending Orders',
        count: dashboardCount?.pendingOrders,
        Icons: PendingActionsIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a52444, #e96443)'
      },
      {
        title: 'Total Sales & Revenue',
        count: dashboardCount?.totalSalesAndRevenue,
        Icons: BarChartIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a52444, #ff758c)'
      },
      {
        title: 'Total Dispatched Orders',
        count: dashboardCount?.totalDispatchedOrders,
        Icons: LocalShippingIcon,
        route: '/vendor-master',
        color: 'linear-gradient(135deg, #a52444, #a18cd1)'
      }
    ];
  return (
    <Grid container spacing={gridSpacing}>

      <Grid sm={12} item>
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
              value={selectedOption}
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
              />
              {/* DatePicker - To */}
              <DatePicker
                minDate={fromDate ? dayjs(fromDate).toDate() : null}
                className="date-picker-input text-nowrap"
                label="To Date"
                value={toDate ? toDate.toDate() : null}
                onChange={handleToDateChange}
                clearIcon={null}
              />
              <button className="btn btn-primary customBtn" onClick={handleClearDates}>
                Clear
              </button>
            </div>
          )}
        </div>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>

          {/* --- LEAD SECTION --- */}
          <Grid item xs={12}>
            {/* <Typography variant="h5" gutterBottom>Leads</Typography> */}
            <Grid container spacing={gridSpacing}>

              {cardData.map((value, index) => (
                <Grid item lg={3} sm={6} xs={12} key={index} >
                  <div onClick={() => navigate(value.route)} style={{ cursor: 'pointer' }}>
                    <ReportCard
                      primary={value.count}
                      footerData={value.title}
                      color={value.color}
                      iconPrimary={value.Icons}
                      iconFooter={TrendingUpIcon}
                    />
                  </div>
                </Grid>
              ))}



            </Grid>
          </Grid>



        </Grid>
      </Grid>

    </Grid >
  );
};

export default Default;
