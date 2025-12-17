// ==============================|| ICON IMPORTS ||============================== //
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import AddchartIcon from '@mui/icons-material/Addchart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HealingIcon from '@mui/icons-material/Healing';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SynagogueIcon from '@mui/icons-material/Synagogue';
import Person from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import ChatIcon from '@mui/icons-material/Chat';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArticleIcon from '@mui/icons-material/Article';
import RepeatIcon from '@mui/icons-material/Repeat';

// ==============================|| ICON OBJECT ||============================== //
const icons = {
  DashboardIcon,
  PeopleIcon,
  PeopleAltIcon,
  WarehouseIcon,
  TempleHindu: TempleHinduIcon,
  AddchartIcon,
  AccountBalanceIcon,
  Healing: HealingIcon,
  Whatshot: WhatshotIcon,
  BedroomParentIcon,
  SettingsInputComponentIcon,
  WebStoriesIcon,
  StoreIcon,
  ShoppingBagIcon,
  SynagogueIcon,
  Person,
  StorefrontIcon,
  AdminPanelSettingsIcon,
  GroupIcon,
  AccountCircleIcon,
  LocalMallIcon,
  ShoppingCartIcon,
  InventoryIcon,
  NotificationsIcon,
  BusinessIcon,
  CategoryIcon,
  ImageIcon,
  ChatIcon,
  CampaignIcon,
  EventIcon,
  BookmarkIcon,
  FavoriteIcon,
  QuestionAnswerIcon,
  ArticleIcon,
  RepeatIcon
};




// ==============================|| MENU ITEMS ||============================== //

// eslint-disable-next-line
export default {
  items: [

    {
      id: 'navigation',
      type: 'group',
      icon: icons.DashboardIcon,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons.DashboardIcon,
          url: '/',
          allowedRoles: [1, 2]
        },
        {
          id: 'user-master',
          title: 'User Master',
          type: 'collapse',
          icon: icons.GroupIcon,
          allowedRoles: [1],
          children: [
            { id: 'admin-master', title: 'Admin Master', type: 'item', icon: icons.AdminPanelSettingsIcon, url: '/admin-master', allowedRoles: [1] },
            { id: 'employee-master', title: 'Temple Staff Management', type: 'item', icon: icons.PeopleAltIcon, url: '/employee-master', allowedRoles: [1] },
            { id: 'pandit-master', title: 'Pandit Management', type: 'item', icon: icons.Person, url: '/pandit-master', allowedRoles: [1] },
            { id: 'app-user-master', title: 'User Management', type: 'item', icon: icons.AccountCircleIcon, url: '/users', allowedRoles: [1] },
            { id: 'user-wallet', title: 'User Wallet', type: 'item', icon: icons.AccountBalanceIcon, url: '/user-wallet', allowedRoles: [1] }
          ]
        },
        { id: 'vendorMaster', title: 'Vendor Master', type: 'item', icon: icons.StorefrontIcon, url: '/vendor-master', allowedRoles: [2] },
        { id: 'wareHouse', title: 'Warehouse', type: 'item', icon: icons.WarehouseIcon, url: '/warehouse', allowedRoles: [2] },
        { id: 'wareHouseStock', title: 'Warehouse Stock', type: 'item', icon: icons.InventoryIcon, url: '/warehouse-stock', allowedRoles: [2] },

        {
          id: 'temple',
          title: 'Temple',
          type: 'collapse',
          icon: icons.TempleHindu,
          allowedRoles: [1],
          children: [
            { id: 'temple', title: 'Temples', type: 'item', icon: icons.TempleHindu, url: '/temples', allowedRoles: [1] },
            { id: 'estore-prasad', title: 'Prasad Master', type: 'item', icon: icons.LocalMallIcon, url: '/prasad-master', allowedRoles: [1] },
            { id: 'darshan', title: 'Darshan Bookings', type: 'item', icon: icons.EventIcon, url: '/darshan-booking', allowedRoles: [1] },
            // { id: 'templePuja', title: 'Puja At Temple', type: 'item', icon: icons.AccountBalanceIcon, url: '/', allowedRoles: [1] }
          ]
        },

        {
          id: 'templePuja',
          title: 'Temple Puja',
          type: 'collapse',
          icon: icons.SynagogueIcon,
          allowedRoles: [1],
          children: [
            { id: 'remedy-puja', title: 'Remedy Puja', type: 'item', icon: icons.Healing, url: '/remedy-puja', allowedRoles: [1] },
            { id: 'homam', title: 'Homam', type: 'item', icon: icons.Whatshot, url: '/homam-puja', allowedRoles: [1] }
          ]
        },

        {
          id: 'sankalpPuja',
          title: 'Sankalp Puja',
          type: 'collapse',
          icon: icons.FavoriteIcon,
          allowedRoles: [1],
          children: [
            { id: 'subscription-puja', title: 'Subscription Remedy Puja', type: 'item', icon: icons.Healing, url: '/subscription-puja', allowedRoles: [1] },
            { id: 'subscription-homam', title: 'Subscription Homam', type: 'item', icon: icons.Whatshot, url: '/subscription-homam', allowedRoles: [1] }
          ]
        },

        {
          id: 'puja',
          title: 'Pandit Puja',
          type: 'collapse',
          icon: icons.Person,
          allowedRoles: [1],
          children: [
            { id: 'panditPuja', title: 'Pandit Puja', type: 'item', icon: icons.Healing, url: '/pandit-puja', allowedRoles: [1] },
            { id: 'dailyPanditPuja', title: 'Daily Pandit (Puja)', type: 'item', icon: icons.RepeatIcon, url: '/daily-pandit-puja', allowedRoles: [1] }
          ]
        },

        {
          id: 'estore',
          title: 'E-Store',
          type: 'collapse',
          icon: icons.StoreIcon,
          allowedRoles: [1],
          children: [
            { id: 'estore-product', title: 'Product', type: 'item', icon: icons.ShoppingBagIcon, url: '/estore-product', allowedRoles: [1] },
            { id: 'estore-product-cat', title: 'Product Category', type: 'item', icon: icons.CategoryIcon, url: '/estore-product-category', allowedRoles: [1] }
          ]
        },

        {
          id: 'booking',
          title: 'Order/Bookings',
          type: 'collapse',
          icon: icons.ShoppingCartIcon,
          allowedRoles: [1],
          children: [
            {
              id: 'pujaBookings',
              title: 'Puja Bookings',
              type: 'collapse',
              icon: icons.EventIcon,
              allowedRoles: [1],
              children: [
                {
                  id: 'panditPujaBookings',
                  title: 'Pandit Puja Booking',
                  type: 'collapse',
                  icon: icons.PeopleAltIcon,
                  allowedRoles: [1],
                  children: [
                    { id: 'panditOrders', title: 'Pandit Booking Orders', type: 'item', icon: icons.AddchartIcon, url: '/pandit-puja-booking', allowedRoles: [1] },
                    { id: 'dailyPanditOrders', title: 'Daily Pandit Booking (Puja)', type: 'item', icon: icons.RepeatIcon, url: '/daily-pandit-puja-booking', allowedRoles: [1] }
                  ]
                },
                { id: 'templePujaBooking', title: 'Puja At Temple Booking', type: 'item', icon: icons.AccountBalanceIcon, url: '/puja-at-temple-booking', allowedRoles: [1] },
                {
                  id: 'templePujaBookingCollapse',
                  title: 'Temple Puja Booking',
                  type: 'collapse',
                  icon: icons.Healing,
                  allowedRoles: [1],
                  children: [
                    { id: 'remedyPujaBooking', title: 'Remedy Puja Booking', type: 'item', icon: icons.Healing, url: '/remedy-puja-booking', allowedRoles: [1] },
                    { id: 'homamBooking', title: 'Homam Booking', type: 'item', icon: icons.Whatshot, url: '/homam-booking', allowedRoles: [1] }
                  ]
                },
                {
                  id: 'sankalpBooking',
                  title: 'Sankalp Puja Booking',
                  type: 'collapse',
                  icon: icons.FavoriteIcon,
                  allowedRoles: [1],
                  children: [
                    { id: 'subscriptionRemedyBooking', title: 'Subscription Remedy Puja Booking', type: 'item', icon: icons.Healing, url: '/subscription-puja-booking', allowedRoles: [1] },
                    { id: 'subscriptionHomamBooking', title: 'Subscription Homam Booking', type: 'item', icon: icons.Whatshot, url: '/subscription-homam-booking', allowedRoles: [1] }
                  ]
                }
              ]
            },
            {
              id: 'estoreOrders',
              title: 'E-Store Orders',
              type: 'collapse',
              icon: icons.LocalMallIcon,
              allowedRoles: [1],
              children: [
                { id: 'productOrders', title: 'Product Orders', type: 'item', icon: icons.ShoppingBagIcon, url: '/estore-bookings', allowedRoles: [1] },
                { id: 'prasadOrders', title: 'Prasad Orders', type: 'item', icon: icons.CategoryIcon, url: '/prasad-bookings', allowedRoles: [1] },
                { id: 'pujaKitOrders', title: 'Puja Kit Orders', type: 'item', icon: icons.InventoryIcon, url: '/puja-kit-bookings', allowedRoles: [1] }
              ]
            },
            { id: 'webinar-users', title: 'Webinar Bookings', type: 'item', icon: icons.EventIcon, url: '/webinar-users', allowedRoles: [1] }
          ]
        },

        { id: 'banner', title: 'Banner', type: 'item', icon: icons.ImageIcon, url: '/banner', allowedRoles: [1] },
        { id: 'CouponCode', title: 'Coupon Code', type: 'item', icon: icons.BookmarkIcon, url: '/coupon-code', allowedRoles: [1] },
        { id: 'blog', title: 'Blog', type: 'item', icon: icons.ArticleIcon, url: '/blog', allowedRoles: [1] },
        { id: 'shopMaster', title: 'Shop Master', type: 'item', icon: icons.StorefrontIcon, url: '/shop-master', allowedRoles: [2] },
        { id: 'Purchase-Management', title: 'Purchase Management', type: 'item', icon: icons.ShoppingBagIcon, url: '/Purchase-Management', allowedRoles: [2] },
        { id: 'spiritual-thought-master', title: 'Spiritual Thought', type: 'item', icon: icons.FavoriteIcon, url: '/thought-master', allowedRoles: [1] },
        { id: 'faq', title: 'FAQ', type: 'item', icon: icons.QuestionAnswerIcon, url: '/faq', allowedRoles: [1] },
        { id: 'image', title: 'Image Master', type: 'item', icon: icons.ImageIcon, url: '/image', allowedRoles: [1] },
        // { id: 'festival-idol-services', title: 'Festival Idol Services', type: 'item', icon: icons.CampaignIcon, url: '/festival-idol-services', allowedRoles: [1] },

        {
          id: 'notification',
          title: 'Notification',
          type: 'collapse',
          icon: icons.NotificationsIcon,
          allowedRoles: [1],
          children: [
            { id: 'notification-template', title: 'Notification Template', type: 'item', icon: icons.SettingsInputComponentIcon, url: '/notification-template', allowedRoles: [1] },
            { id: 'calender-notification', title: 'Calender Notification', type: 'item', icon: icons.EventIcon, url: '/calender-notification', allowedRoles: [1] },
            { id: 'regular-notification', title: 'Regular Notification', type: 'item', icon: icons.CampaignIcon, url: '/regular-notification', allowedRoles: [1] }
          ]
        },

        {
          id: 'business-master',
          title: 'Business Master',
          type: 'collapse',
          icon: icons.BusinessIcon,
          allowedRoles: [1],
          children: [
            { id: 'stall-business', title: 'Stall Business', type: 'item', icon: icons.StorefrontIcon, url: '/stall-business', allowedRoles: [1] },
            { id: 'mandal-business', title: 'Mandal Business', type: 'item', icon: icons.StoreIcon, url: '/mandal-business', allowedRoles: [1] },
            // { id: 'festival-ido-booking-list', title: 'Festival Idol Booking List', type: 'item', icon: icons.BookmarkIcon, url: '/festival-idol-booking-list', allowedRoles: [1] }
          ]
        },

        // {
        //   id: 'puja-kit',
        //   title: 'Puja Kit',
        //   type: 'collapse',
        //   icon: icons.LocalMallIcon,
        //   allowedRoles: [1],
        //   children: [
        //     { id: 'puja-kit-package', title: 'Puja Kit Package', type: 'item', icon: icons.CategoryIcon, url: '/puja-kit-package', allowedRoles: [1] },
        //     { id: 'puja-kit-booking-list', title: 'Puja Kit Booking List', type: 'item', icon: icons.AddchartIcon, url: '/puja-kit-booking-list', allowedRoles: [1] },
        //     { id: 'refill-list', title: 'Refill List', type: 'item', icon: icons.RepeatIcon, url: '/refill-list', allowedRoles: [1] }
        //   ]
        // },

        {
          id: 'enquiry-master',
          title: 'Enquiry Master',
          type: 'collapse',
          icon: icons.ChatIcon,
          allowedRoles: [1],
          children: [
            { id: 'newsletter', title: 'Newsletter', type: 'item', icon: icons.ArticleIcon, url: '/newsletter', allowedRoles: [1] },
            { id: 'contact-us', title: 'Contact Us', type: 'item', icon: icons.QuestionAnswerIcon, url: '/contact-us', allowedRoles: [1] }
          ]
        },

        {
          id: 'master',
          title: 'Master',
          type: 'collapse',
          icon: icons.SettingsInputComponentIcon,
          allowedRoles: [1],
          children: [
            { id: 'puja-category', title: 'Pandit Puja Category', type: 'item', icon: icons.TempleHindu, url: '/puja-category', allowedRoles: [1] },
            { id: 'time-slot', title: 'Time Slot', type: 'item', icon: icons.EventIcon, url: '/time-slot', allowedRoles: [1] },
            { id: 'unit', title: 'Unit', type: 'item', icon: icons.AddchartIcon, url: '/unit', allowedRoles: [1] },
            { id: 'deity', title: 'Deity', type: 'item', icon: icons.CategoryIcon, url: '/deity-list', allowedRoles: [1] },
            { id: 'benefits', title: 'Benefits', type: 'item', icon: icons.BookmarkIcon, url: '/benefits', allowedRoles: [1] },
            { id: 'blogCat', title: 'Blog Category', type: 'item', icon: icons.WebStoriesIcon, url: '/blog-category', allowedRoles: [1] },
            { id: 'image-category', title: 'Image Category', type: 'item', icon: icons.ImageIcon, url: '/image-category', allowedRoles: [1] },
            { id: 'state', title: 'State', type: 'item', icon: icons.BusinessIcon, url: '/state', allowedRoles: [1] },
            { id: 'district', title: 'District', type: 'item', icon: icons.BusinessIcon, url: '/district', allowedRoles: [1] }
          ]
        }
      ]
    }

  ]
};
