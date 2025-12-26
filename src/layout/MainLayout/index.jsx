import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery, AppBar, Box, Toolbar } from '@mui/material';

// project import
import { drawerWidth } from 'config.js';
import Header from './Header';
import Sidebar from './Sidebar';

// custom style
const Main = styled((props) => <main {...props} />)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: -drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

const OutletDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3)
  },
  padding: theme.spacing(5)
}));

// ==============================|| MAIN LAYOUT ||============================== //
const routeTitles = {
  '/': 'Dashboard - Myomnamo',
  '/lead': 'Lead - Myomanmo',
  '/vendor-master': 'Vendor Master  - Myomnamo',
  '/warehouse': 'Warehouse  - Myomnamo',
  '/Purchase-Management': 'Purchase Management  - Myomnamo',
  '/shop-master': 'Shop Master  - Myomnamo',
  '/stock': 'Stock Master  - Myomnamo',
  '/material': 'Material Master  - Myomnamo',

  // Booking

  '/pandit-puja-booking': 'Pandit Puja Booking  - Myomnamo',
  '/daily-pandit-puja-booking': 'Daily Pandit (Puja)  - Myomnamo',
  '/remedy-puja-booking': 'Remedy Puja Booking  - Myomnamo',
  '/homam-booking': 'Homam Booking  - Myomnamo',
  '/subscription-puja-booking': 'Subscription Puja Booking  - Myomnamo',
  '/subscription-homam-booking': 'Subscription Homam Booking  - Myomnamo',
  '/puja-at-temple-booking': 'Puja At Temple Booking  - Myomnamo',
  '/estore-bookings': 'Estore Bookings  - Myomnamo',
  '/prasad-bookings': 'Prasad Bookings  - Myomnamo',

  // Estore
  '/estore-product-category': 'Product Category  - Myomnamo',
  '/estore-product': 'Product  - Myomnamo',
  '/prasad-master': 'Prasad Master  - Myomnamo',
  '/darshan-booking': 'Darshan Booking  - Myomnamo',
  '/unit': 'Unit - Myomnamo',
  '/add-image': 'Add Product Image - Myomnamo',

  // banner
  '/banner': 'Banner - Myomnamo',
  '/banner-language-wise': 'Banner Language List - Myomnamo',

  // thought-master
  '/thought-master': 'Spiritual Thought Master - Myomnamo',
  '/thought-language-wise': 'Spiritual Thought Language Wise - Myomnamo',

  // user wallet
  '/user-wallet': 'User Wallet - Myomnamo',

  // contact-us
  '/contact-us': 'Contact Us - Myomnamo',

  // newsletter
  '/webinar-users': 'Webinar Users List - Myomnamo',

  // newsletter
  '/coupon-code': 'Coupon Code List - Myomnamo',

  // newsletter
  '/newsletter': 'Newsletter List - Myomnamo',

  // image-master
  '/image': 'Image Master - Myomnamo',
  '/image-category': 'Image Category - Myomnamo',

  // /faq
  '/faq': 'FAQ - Myomnamo',
  '/faq-language-wise': 'FAQ Language Wise - Myomnamo',

  // Notification
  '/notification-template': 'Notification Template  - Myomnamo',
  '/calender-notification': 'Calender Notification   - Myomnamo',
  '/regular-notification': 'Regular Notification   - Myomnamo',

  //master-state and district
  '/state': 'State - Myomnamo',
  '/language-wise-state': 'State Language- Myomnamo',
  '/district': 'District - Myomnamo',
  '/language-wise-district': 'District Language- Myomnamo',

  '/puja-category': 'Puja Category  - Myomnamo',
  '/puja-sub-category': 'Puja Sub  Category  - Myomnamo',
  '/deity-list': 'Deity  - Myomnamo',
  '/benefits': 'Benefits  - Myomnamo',
  '/temples': 'Temples  - Myomnamo',
  '/temple-puja': 'Temple Puja - Myomnamo',
  '/temple-puja-category': 'Temple Puja Category- Myomnamo',
  '/temple-puja-sub-category': 'Temple Puja Sub Category- Myomnamo',
  '/language-wise-temple': 'Temple wise Language List- Myomnamo',
  '/temple-images': 'Temple wise Images List- Myomnamo',
  '/blog': 'Blog- Myomnamo',
  '/language-wise-blog-category': 'Blog Category Language- Myomnamo',
  '/language-wise-blog': 'Blog Language- Myomnamo',
  '/blog-category': 'Blog Category- Myomnamo',
  '/pandit-puja': 'Pandit Puja- Myomnamo',
  '/daily-pandit-puja': 'Daily Pandit Puja- Myomnamo',
  '/language-wise-puja': 'Language wise Puja- Myomnamo',
  '/homam-puja': 'Homam Puja- Myomnamo',
  '/remedy-puja': 'Remedy Puja- Myomnamo',
  '/subscription-homam': 'Homam Subscription - Myomnamo',
  '/subscription-puja': 'Remedy Subscription - Myomnamo',
  '/language-wise-deity': 'Language wise Deity - Myomnamo',
  '/language-wise-benefit': 'Language wise Benefit - Myomnamo',
  '/language-wise-puja-category': 'Language wise Puja Category - Myomnamo',
  '/product-category-language-wise': 'Language wise Product Category - Myomnamo',
  '/product-language-wise': 'Language wise Product - Myomnamo',
  '/prasad-language-wise': 'Language wise Prasad - Myomnamo',
  '/darshan-booking-language-wise': 'Language wise Darshan Booking - Myomnamo',
  '/time-slot': 'Time Slot - Myomnamo',
  '/language-wise-time-slot': 'Language wise Time Slot - Myomnamo',
  '/packages-List': 'Sankalp Packages - Myomnamo',
  '/users': 'Users - Myomnamo',
  '/admin-profile': 'Profile - Myomnamo',
  '/admin-master': 'Admin Master - Myomnamo',
  '/pandit-master': 'Pandit Management - Myomnamo',
  '/product-subscription-package': 'Product Subscription  - Myomnamo',
  '/product-subscription-language': 'Product Subscription Langauge - Myomnamo',
  '/puja-kit-bookings': 'Puja Kit Subscription Orders - Myomnamo',
  '/festival-idol-services': 'Festival Idol Services - Myomnamo',
  '/stall-business': 'Stall Business - Myomnamo',
  '/mandal-business': 'Mandal Business - Myomnamo',
  '/festival-idol-booking-list': 'Festival Idol Booking List - Myomnamo',
};

const MainLayout = () => {
  // Detect route changes
  const location = useLocation();

  const theme = useTheme();
  const matchUpLg = useMediaQuery(theme.breakpoints.up('lg'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  React.useEffect(() => {
    // Update the document title based on the current path
    const title = routeTitles[location.pathname];
    document.title = title;
  }, [location]);

  React.useEffect(() => {
    setDrawerOpen(matchUpLg);
  }, [matchUpLg]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1200,
          background: 'linear - gradient(90deg, #991b3d 0 %, #f4b722 100 %)'
        }}
      >
        <Toolbar>
          <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
      <Main
        style={{
          ...(drawerOpen && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0,
            marginRight: 'inherit'
          })
        }}
      >
        <Box sx={theme.mixins.toolbar} />
        <OutletDiv>
          <Outlet />
        </OutletDiv>
      </Main>
    </Box>
  );
};

export default MainLayout;
