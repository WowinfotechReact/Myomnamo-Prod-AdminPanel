import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

import { useAuth } from 'context/ConfigContext';
import Loader from 'component/Loader/Loader';
import PoojaCategoryList from 'views/Pooja Category/PoojaCategory';
import PujaSubCategoryList from 'views/Puja Sub Category/PujaSubCategoryList';
import TemplePujaList from 'views/Admin Temple/Temple Puja/TemplePujaList';
import TemplePujaCategoryList from 'views/Admin Temple/Temple Puja Category/TemplePujaCategoryList';
import TemplePujaSubCategoryList from 'views/Admin Temple/Temple Puja Sub Category/TemplePujaSubCategoryList';
import WareHouseList from 'views/Ware House/WareHouseList';
import BlogList from 'views/Blog/BlogList';
import BlogCategoryList from 'views/Blog Catgory/BlogCategoryList';
import BlogCategoryLanguageWiseList from 'views/Blog Catgory/Language Wise Blog Category/BlogCategoryLanguageWiseList';
import LanguageWiseBlogList from 'views/Blog/Language Wise Blog/LanguageWiseBlogList';
import UnitList from 'views/Admin/UnitMaster/UnitList';
import StateListComponent from 'views/Admin/State/StateList';
import DistrictListComponent from 'views/Admin/District/DistrictList';
import StateLanguageWiseList from 'views/Admin/State/Language Wise State/StateLanguageWiseList';
import DistrictLanguageWiseList from 'views/Admin/District/Language Wise State/DistrictLanguageWiseList';
import TimeSlot from 'views/Admin/TimeSlot';
import TimeSlotLanguageWiseList from 'views/Admin/TimeSlot/Language Wise Slot';
import LanguageWisePackage from 'views/Admin/Packages/LanguageWisePackage';
import StallBusinessList from 'views/Stall Business/StallBusinessList';
import MandalBusinessList from 'views/Mandal Business/MandalBusinessList';
import FestivalIdlBookings from 'views/Festival Idol Booking';
import AdminMasterList from 'views/Admin/Admin Master/AdminMasterList';
import EmployeeMasterList from 'views/Admin/Employee Master/EmployeeMasterList';
import PanditMasterList from 'views/Admin/Pandit Master/PanditMasterList';
import ProductSubscriptionPackageList from 'views/Admin/Estore/ProductSubscriptionPackageList';
import LanguageWisePackageList from 'views/Admin/Estore/LanguageWisePackageList';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const LeadList = Loadable(lazy(() => import('views/Lead/LeadList')));
const Profile = Loadable(lazy(() => import('views/Profile')));
const VendorMaster = Loadable(lazy(() => import('views/VendorMaster/VendorMaster')));
const Warehouse = Loadable(lazy(() => import('views/WareHouse Stock/Warehouse')));
const PurchaseManagement = Loadable(lazy(() => import('views/PurchaseManagement/PurchaseManagement')));
const ShopMaster = Loadable(lazy(() => import('views/ShopMaster/ShopMaster')));
const MaterialPage = Loadable(lazy(() => import('views/Material/MaterialPage')));
const StockPage = Loadable(lazy(() => import('views/Stock/StockPage')));

// -----------Admin----------------------
const TempleListPage = Loadable(lazy(() => import('views/Admin Temple/Temple/TempleListPage')));
const LanguageWiseTempleList = Loadable(lazy(() => import('views/Admin Temple/Temple/LanguageWiseTempleList')));
const BenefitListPage = Loadable(lazy(() => import('views/Admin/Benefit/BenefitListPage')));
const DeityListPage = Loadable(lazy(() => import('views/Admin/Deity/DeityListPage')));
const TempleImagesListPage = Loadable(lazy(() => import('../views/Admin Temple/Temple/TempleImagesListPage')));
const PujaCategoryLanguageWiseList = Loadable(lazy(() => import('../views/Pooja Category/PujaCategoryLanguageWiseList')));
const PanditPujaList = Loadable(lazy(() => import('../views/Admin/PanditPuja/PanditPujaList')));
const LanguageWisePujaList = Loadable(lazy(() => import('../views/Admin/PanditPuja/LanguageWisePujaList')));
const SubscriptionList = Loadable(lazy(() => import('../views/Admin/Subscription/SubscriptionList')));
const LanguageWiseDeityList = Loadable(lazy(() => import('../views/Admin/Deity/LanguageWiseDeityList')));
const LanguageWiseBenefitList = Loadable(lazy(() => import('../views/Admin/Benefit/LanguageWiseBenefitList')));
const PujaBookingList = Loadable(lazy(() => import('../views/Admin/PujaBooking/PujaBookingList')));
const EstoreBookingList = Loadable(lazy(() => import('../views/Admin/PujaBooking/EstoreBookings/EstoreBookings')));
const PrasadBookingList = Loadable(lazy(() => import('../views/Admin/PujaBooking/PrasadBooking/PrasadBookingList')));
const ProductCategoryList = Loadable(lazy(() => import('../views/Admin/Estore/ProductCategoryList')));
const ProductList = Loadable(lazy(() => import('../views/Admin/Estore/ProductList')));
const ProductCategoryLanguageWiseList = Loadable(lazy(() => import('../views/Admin/Estore/ProductCategoryLanguageWiseList')));
const ProductLanguageWiseList = Loadable(lazy(() => import('../views/Admin/Estore/ProductLanguageWiseList')));
const DarshanBookingList = Loadable(lazy(() => import('../views/Admin Temple/DarshanBooking/DarshanBookingList')));
const DarshanBookingLanguageWiseList = Loadable(lazy(() => import('../views/Admin Temple/DarshanBooking/DarshanBookingLanguageWiseList')));
const PackagesListPage = Loadable(lazy(() => import('../views/Admin/Packages/PackagesListPage')));
const BannerList = Loadable(lazy(() => import('../views/Admin/BannerList/BannerList')));
const NotificationList = Loadable(lazy(() => import('../views/Admin/NotificationList/NotificationList')));
const CalenderNotificationList = Loadable(lazy(() => import('../views/Admin/NotificationList/CalenderNotificationList')));
const UserWalletList = Loadable(lazy(() => import('../views/Admin/UserWallet/UserWallet')));
const ThoughtMasterList = Loadable(lazy(() => import('../views/Admin/ThoughtList/ThoughtMasterList')));
const ThoughtLanguageWiseList = Loadable(lazy(() => import('../views/Admin/ThoughtList/ThoughtLanguageWiseList')));
const RegularNotificationList = Loadable(lazy(() => import('../views/Admin/NotificationList/RegularNotificationList')));
const ContactUsList = Loadable(lazy(() => import('../views/Admin/ContactUsList/ContactUsList')));
const FAQList = Loadable(lazy(() => import('../views/Admin/FAQList/FAQList')));
const FAQListLanguageWise = Loadable(lazy(() => import('../views/Admin/FAQList/FAQLanguageWise')));
const NewsLetterList = Loadable(lazy(() => import('../views/Admin/NewsLetterList/NewsLetterList')));
const WebinarUsersList = Loadable(lazy(() => import('../views/Admin/WebinarUsersList/WebinarUsersList')));
const DarshanBookingListView = Loadable(lazy(() => import('../views/Admin/DarshanBookingListView/DarshanBookingListView')));
const CouponCodeList = Loadable(lazy(() => import('../views/Admin/CouponCodeList/CouponCodeList')));
const ImageList = Loadable(lazy(() => import('../views/Admin/ImageMaster/ImageList')));
const ImageCatList = Loadable(lazy(() => import('../views/Admin/ImageMaster/ImageCategoryList')));
const ProductImageList = Loadable(lazy(() => import('../views/Admin/Estore/ProductImageList')));
const BannerLanguageWiseList = Loadable(lazy(() => import('../views/Admin/BannerList/BannerLanguageWiseList')));
const UsersList = Loadable(lazy(() => import('../views/Admin/Users/UsersList')));
const PujaKitSubscriptionOrderList = Loadable(lazy(() => import('../views/Admin/PujaBooking/PujaKitSubscriptionOrder/PujaKitSubscriptionOrderList')));

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('user'));
    if (!storedAuth) {
      navigate('/login');
    }
  }, []);
  const { authToken } = useAuth();

  return authToken ? <Suspense fallback={<Loader />}>{children}</Suspense> : <Navigate to="/login" />;
};
// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardDefault />
        </Suspense>
      )
    },

    {
      path: '/admin-profile',
      element: (
        <Suspense fallback={<Loader />}>
          <Profile />
        </Suspense>
      )
    },
    {
      path: '/vendor-master',
      element: (
        <Suspense fallback={<Loader />}>
          <VendorMaster />
        </Suspense>
      )
    },
    {
      path: '/warehouse-stock',
      element: (
        <Suspense fallback={<Loader />}>
          <Warehouse />
        </Suspense>
      )
    },
    {
      path: '/warehouse',
      element: (
        <Suspense fallback={<Loader />}>
          <WareHouseList />
        </Suspense>
      )
    },
    {
      path: '/Purchase-Management',
      element: (
        <Suspense fallback={<Loader />}>
          <PurchaseManagement />
        </Suspense>
      )
    },
    {
      path: '/shop-master',
      element: (
        <Suspense fallback={<Loader />}>
          <ShopMaster />
        </Suspense>
      )
    },
    {
      path: '/material',
      element: (
        <Suspense fallback={<Loader />}>
          <MaterialPage />
        </Suspense>
      )
    },
    {
      path: '/stock',
      element: (
        <Suspense fallback={<Loader />}>
          <StockPage />
        </Suspense>
      )
    },
    {
      path: '/temples',
      element: (
        <Suspense fallback={<Loader />}>
          <TempleListPage />
        </Suspense>
      )
    },
    {
      path: '/language-wise-temple',
      element: (
        <Suspense fallback={<Loader />}>
          <LanguageWiseTempleList />
        </Suspense>
      )
    },
    {
      path: '/benefits',
      element: (
        <Suspense fallback={<Loader />}>
          <BenefitListPage />
        </Suspense>
      )
    },
    {
      path: '/deity-list',
      element: (
        <Suspense fallback={<Loader />}>
          <DeityListPage />
        </Suspense>
      )
    },
    {
      path: '/puja-category',
      element: (
        <Suspense fallback={<Loader />}>
          <PoojaCategoryList />
        </Suspense>
      )
    },
    {
      path: '/puja-sub-category',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaSubCategoryList />
        </Suspense>
      )
    },

    // from here
    {
      path: '/temple-puja',
      element: (
        <Suspense fallback={<Loader />}>
          <TemplePujaList />
        </Suspense>
      )
    },
    {
      path: '/temple-puja-category',
      element: (
        <Suspense fallback={<Loader />}>
          <TemplePujaCategoryList />
        </Suspense>
      )
    },
    {
      path: '/temple-puja-sub-category',
      element: (
        <Suspense fallback={<Loader />}>
          <TemplePujaSubCategoryList />
        </Suspense>
      )
    },
    {
      path: '/temple-images',
      element: (
        <Suspense fallback={<Loader />}>
          <TempleImagesListPage />
        </Suspense>
      )
    },
    {
      path: '/language-wise-puja-category',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaCategoryLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/pandit-puja',
      element: (
        <Suspense fallback={<Loader />}>
          <PanditPujaList />
        </Suspense>
      )
    },
    {
      path: '/blog',
      element: (
        <Suspense fallback={<Loader />}>
          <BlogList />
        </Suspense>
      )
    },
    {
      path: '/blog-category',
      element: (
        <Suspense fallback={<Loader />}>
          <BlogCategoryList />
        </Suspense>
      )
    },
    {
      path: '/language-wise-blog-category',
      element: (
        <Suspense fallback={<Loader />}>
          <BlogCategoryLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/language-wise-blog',
      element: (
        <Suspense fallback={<Loader />}>
          <LanguageWiseBlogList />
        </Suspense>
      )
    },
    {
      path: '/daily-pandit-puja',
      element: (
        <Suspense fallback={<Loader />}>
          <PanditPujaList />
        </Suspense>
      )
    },
    {
      path: '/remedy-puja',
      element: (
        <Suspense fallback={<Loader />}>
          <PanditPujaList />
        </Suspense>
      )
    },
    {
      path: '/homam-puja',
      element: (
        <Suspense fallback={<Loader />}>
          <PanditPujaList />
        </Suspense>
      )
    },
    {
      path: '/language-wise-puja',
      element: (
        <Suspense fallback={<Loader />}>
          <LanguageWisePujaList />
        </Suspense>
      )
    },
    {
      path: '/subscription-puja',
      element: (
        <Suspense fallback={<Loader />}>
          <SubscriptionList />
        </Suspense>
      )
    },
    {
      path: '/subscription-homam',
      element: (
        <Suspense fallback={<Loader />}>
          <SubscriptionList />
        </Suspense>
      )
    },
    {
      path: '/language-wise-deity',
      element: (
        <Suspense fallback={<Loader />}>
          <LanguageWiseDeityList />
        </Suspense>
      )
    },
    {
      path: '/language-wise-benefit',
      element: (
        <Suspense fallback={<Loader />}>
          <LanguageWiseBenefitList />
        </Suspense>
      )
    },
    {
      path: '/pandit-puja-booking',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaBookingList />
        </Suspense>
      )
    },
    {
      path: '/daily-pandit-puja-booking',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaBookingList />
        </Suspense>
      )
    },
    {
      path: '/remedy-puja-booking',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaBookingList />
        </Suspense>
      )
    },
    {
      path: '/homam-booking',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaBookingList />
        </Suspense>
      )
    },
    {
      path: '/subscription-puja-booking',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaBookingList />
        </Suspense>
      )
    },
    {
      path: '/subscription-homam-booking',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaBookingList />
        </Suspense>
      )
    },
    {
      path: '/puja-at-temple-booking',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaBookingList />
        </Suspense>
      )
    },
    {
      path: '/estore-bookings',
      element: (
        <Suspense fallback={<Loader />}>
          <EstoreBookingList />
        </Suspense>
      )
    },
    {
      path: '/prasad-bookings',
      element: (
        <Suspense fallback={<Loader />}>
          <PrasadBookingList />
        </Suspense>
      )
    },
    {
      path: '/puja-kit-bookings',
      element: (
        <Suspense fallback={<Loader />}>
          <PujaKitSubscriptionOrderList />
        </Suspense>
      )
    },
    {
      path: '/packages-List',
      element: (
        <Suspense fallback={<Loader />}>
          <PackagesListPage />
        </Suspense>
      )
    },
    {
      path: '/language-wise-package',
      element: (
        <Suspense fallback={<Loader />}>
          <LanguageWisePackage />
        </Suspense>
      )
    },
    {
      path: '/estore-product-category',
      element: (
        <Suspense fallback={<Loader />}>
          <ProductCategoryList />
        </Suspense>
      )
    },
    {
      path: '/product-category-language-wise',
      element: (
        <Suspense fallback={<Loader />}>
          <ProductCategoryLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/product-language-wise',
      element: (
        <Suspense fallback={<Loader />}>
          <ProductLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/prasad-language-wise',
      element: (
        <Suspense fallback={<Loader />}>
          <ProductLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/darshan-booking-language-wise',
      element: (
        <Suspense fallback={<Loader />}>
          <DarshanBookingLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/estore-product',
      element: (
        <Suspense fallback={<Loader />}>
          <ProductList />
        </Suspense>
      )
    },
    {
      path: '/prasad-master',
      element: (
        <Suspense fallback={<Loader />}>
          <ProductList />
        </Suspense>
      )
    },
    {
      path: '/darshan-booking',
      element: (
        <Suspense fallback={<Loader />}>
          <DarshanBookingList />
        </Suspense>
      )
    },
    {
      path: '/banner',
      element: (
        <Suspense fallback={<Loader />}>
          <BannerList />
        </Suspense>
      )
    },
    {
      path: '/banner-language-wise',
      element: (
        <Suspense fallback={<Loader />}>
          <BannerLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/notification-template',
      element: (
        <Suspense fallback={<Loader />}>
          <NotificationList />
        </Suspense>
      )
    },
    {
      path: '/calender-notification',
      element: (
        <Suspense fallback={<Loader />}>
          <CalenderNotificationList />
        </Suspense>
      )
    },
    {
      path: '/user-wallet',
      element: (
        <Suspense fallback={<Loader />}>
          <UserWalletList />
        </Suspense>
      )
    },
    {
      path: '/thought-master',
      element: (
        <Suspense fallback={<Loader />}>
          <ThoughtMasterList />
        </Suspense>
      )
    },
    {
      path: '/thought-language-wise',
      element: (
        <Suspense fallback={<Loader />}>
          <ThoughtLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/regular-notification',
      element: (
        <Suspense fallback={<Loader />}>
          <RegularNotificationList />
        </Suspense>
      )
    },
    {
      path: '/contact-us',
      element: (
        <Suspense fallback={<Loader />}>
          <ContactUsList />
        </Suspense>
      )
    },
    {
      path: '/faq',
      element: (
        <Suspense fallback={<Loader />}>
          <FAQList />
        </Suspense>
      )
    },
    {
      path: '/faq-language-wise',
      element: (
        <Suspense fallback={<Loader />}>
          <FAQListLanguageWise />
        </Suspense>
      )
    },
    {
      path: '/newsletter',
      element: (
        <Suspense fallback={<Loader />}>
          <NewsLetterList />
        </Suspense>
      )
    },
    {
      path: '/DarshanBookingListView',
      element: (
        <Suspense fallback={<Loader />}>
          <DarshanBookingListView />
        </Suspense>
      )
    },
    {
      path: '/webinar-users',
      element: (
        <Suspense fallback={<Loader />}>
          <WebinarUsersList />
        </Suspense>
      )
    },
    {
      path: '/coupon-code',
      element: (
        <Suspense fallback={<Loader />}>
          <CouponCodeList />
        </Suspense>
      )
    },
    {
      path: '/image',
      element: (
        <Suspense fallback={<Loader />}>
          <ImageList />
        </Suspense>
      )
    },
    {
      path: '/image-category',
      element: (
        <Suspense fallback={<Loader />}>
          <ImageCatList />
        </Suspense>
      )
    },
    {
      path: '/unit',
      element: (
        <Suspense fallback={<Loader />}>
          <UnitList />
        </Suspense>
      )
    },
    {
      path: '/state',
      element: (
        <Suspense fallback={<Loader />}>
          <StateListComponent />
        </Suspense>
      )
    },
    {
      path: '/language-wise-state',
      element: (
        <Suspense fallback={<Loader />}>
          <StateLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/district',
      element: (
        <Suspense fallback={<Loader />}>
          <DistrictListComponent />
        </Suspense>
      )
    },
    {
      path: '/language-wise-district',
      element: (
        <Suspense fallback={<Loader />}>
          <DistrictLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/time-slot',
      element: (
        <Suspense fallback={<Loader />}>
          <TimeSlot />
        </Suspense>
      )
    },
    {
      path: '/language-wise-time-slot',
      element: (
        <Suspense fallback={<Loader />}>
          <TimeSlotLanguageWiseList />
        </Suspense>
      )
    },
    {
      path: '/add-image',
      element: (
        <Suspense fallback={<Loader />}>
          <ProductImageList />
        </Suspense>
      )
    },
    {
      path: '/users',
      element: (
        <Suspense fallback={<Loader />}>
          <UsersList />
        </Suspense>
      )
    },
    {
      path: '/stall-business',
      element: (
        <Suspense fallback={<Loader />}>
          <StallBusinessList />
        </Suspense>
      )
    },
    {
      path: '/mandal-business',
      element: (
        <Suspense fallback={<Loader />}>
          <MandalBusinessList />
        </Suspense>
      )
    },
    {
      path: '/festival-idol-booking-list',
      element: (
        <Suspense fallback={<Loader />}>
          <FestivalIdlBookings />
        </Suspense>
      )
    },
    {
      path: '/admin-master',
      element: (
        <Suspense fallback={<Loader />}>
          <AdminMasterList />
        </Suspense>
      )
    },
    {
      path: '/employee-master',
      element: (
        <Suspense fallback={<Loader />}>
          <EmployeeMasterList />
        </Suspense>
      )
    },
    {
      path: '/pandit-master',
      element: (
        <Suspense fallback={<Loader />}>
          <PanditMasterList />
        </Suspense>
      )
    },
    {
      path: '/product-subscription-package',
      element: (
        <Suspense fallback={<Loader />}>
          <ProductSubscriptionPackageList />
        </Suspense>
      )
    },
    {
      path: '/product-subscription-language',
      element: (
        <Suspense fallback={<Loader />}>
          <LanguageWisePackageList />
        </Suspense>
      )
    },
  ]
};

export default MainRoutes;
