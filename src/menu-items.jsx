import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import AddchartIcon from '@mui/icons-material/Addchart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SynagogueIcon from '@mui/icons-material/Synagogue';
import StoreIcon from '@mui/icons-material/Store';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { Healing, Person, Repeat, TempleHindu, Whatshot } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // temple-like structure

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  DashboardIcon: DashboardIcon,
  PeopleAltIcon: PeopleAltIcon,
  StorefrontIcon: StorefrontIcon,
  SynagogueIcon: SynagogueIcon,
  Diversity1Icon: Diversity1Icon,
  WorkspacesIcon: WorkspacesIcon,
  AutorenewIcon: AutorenewIcon,
  AddchartIcon: AddchartIcon,
  HomeIcon: HomeIcon,
  StoreIcon: StoreIcon,
  SensorOccupiedIcon: SensorOccupiedIcon,
  SettingsInputComponentIcon: SettingsInputComponentIcon,
  InventoryIcon: InventoryIcon,
  WarehouseIcon: WarehouseIcon,
  ProductionQuantityLimitsIcon: ProductionQuantityLimitsIcon,
  ShoppingBagIcon: ShoppingBagIcon,
  BedroomParentIcon: BedroomParentIcon,
  WebStoriesIcon: WebStoriesIcon,
  WarehouseIcon: WarehouseIcon,
  Person: Person,
  Repeat: Repeat,
  Whatshot: Whatshot,
  TempleHindu: TempleHindu,
  Healing: Healing,
  AccountBalanceIcon: AccountBalanceIcon
};

// ==============================|| MENU ITEMS ||============================== //

// eslint-disable-next-line
export default {
  items: [
    {
      id: 'navigation',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeIcon'],
          url: '/',
          allowedRoles: [1, 2] // dono ke liye
        },

        {
          id: 'vendorMaster',
          title: 'Vendor Master',
          type: 'item',
          icon: icons['PeopleAltIcon'],
          url: '/vendor-master',
          allowedRoles: [2] // only Admin
        },
        {
          id: 'wareHouse',
          title: 'Warehouse',
          type: 'item',
          icon: icons['WarehouseIcon'],
          url: '/warehouse',
          allowedRoles: [2] // bs Inventory
        },

        {
          id: 'wareHouseStock',
          title: 'Warehouse Stock',
          type: 'item',
          icon: icons['WarehouseIcon'],
          url: '/warehouse-stock',
          allowedRoles: [2] // bs Inventory
        },

        {
          id: 'blog',
          title: 'Blog',
          type: 'collapse',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          children: [
            {
              id: 'blogCat',
              title: 'Blog Category',
              type: 'item',
              icon: icons['StorefrontIcon'],
              url: '/blog-category',
              allowedRoles: [1]
            },
            {
              id: 'blog',
              title: 'Blog',
              type: 'item',
              icon: icons['WebStoriesIcon'],
              url: '/blog',
              allowedRoles: [1]
            }
          ]
        },
        {
          id: 'puja',
          title: 'Pandit Puja',
          type: 'collapse',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          children: [
            {
              id: 'puja',
              title: 'Pandit Puja Category',
              type: 'item',
              icon: icons['TempleHindu'],
              url: '/puja-category',
              allowedRoles: [1]
            },
            {
              id: 'panditPuja',
              title: 'Pandit Puja',
              type: 'item',
              icon: icons['Person'],
              url: '/pandit-puja',
              allowedRoles: [1]
            },
            {
              id: 'dailyPanditPuja',
              title: 'Daily Pandit (Puja) ',
              type: 'item',
              icon: icons['Person'],
              url: '/daily-pandit-puja',
              allowedRoles: [1]
            }
          ]
        },

        // Temples DropDown
        {
          id: 'temple',
          title: 'Temple',
          type: 'collapse',
          icon: icons['TempleHindu'],
          allowedRoles: [1],
          children: [
            {
              id: 'temple',
              title: 'Temples',
              type: 'item',
              icon: icons['TempleHindu'],
              url: '/temples',
              allowedRoles: [1]
            },
            {
              id: 'estore-prasad',
              title: 'Prasad Master',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/prasad-master',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'darshan',
              title: 'Darshan Bookings',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/darshan-booking',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'time-slot',
              title: 'Time Slot',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/time-slot',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'templePuja',
              title: 'Temple Puja',
              type: 'collapse',
              icon: icons['SynagogueIcon'],
              allowedRoles: [1],
              children: [
                {
                  id: 'templePuja',
                  title: 'Remedy Puja',
                  type: 'item',
                  icon: icons['Healing'],
                  url: '/remedy-puja',
                  allowedRoles: [1]
                },
                {
                  id: 'templePuja',
                  title: 'Homam',
                  type: 'item',
                  icon: icons['Whatshot'],
                  url: '/homam-puja',
                  allowedRoles: [1]
                },
                {
                  id: 'templePuja',
                  title: 'Subscription Puja',
                  type: 'item',
                  icon: icons['Healing'],
                  url: '/subscription-puja',
                  allowedRoles: [1]
                },
                {
                  id: 'templePuja',
                  title: 'Subscription Homam',
                  type: 'item',
                  icon: icons['Whatshot'],
                  url: '/subscription-homam',
                  allowedRoles: [1]
                },
                {
                  id: 'templePuja',
                  title: 'Puja At Temple',
                  type: 'item',
                  icon: icons['AccountBalanceIcon'],
                  url: '/',
                  allowedRoles: [1]
                }
              ]
            }

            // {
            //   id: 'templePujaCat',
            //   title: 'Temple Puja Category',
            //   type: 'item',
            //   icon: icons['Diversity1Icon'],
            //   url: '/temple-puja-category',
            //   allowedRoles: [1]

            // },
            // {
            //   id: 'templePujaSubCat',
            //   title: 'Temple Puja Sub Category',
            //   type: 'item',
            //   icon: icons['WorkspacesIcon'],
            //   url: '/temple-puja-sub-category',
            //   allowedRoles: [1]

            // },
            // {
            //   id: 'templePuja',
            //   title: 'Temple Puja',
            //   type: 'item',
            //   icon: icons['SensorOccupiedIcon'],
            //   url: '/temple-puja',
            //   allowedRoles: [1]

            // },
          ]
        },

        // Booking
        {
          id: 'booking',
          title: 'Bookings',
          type: 'collapse',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          children: [
            {
              id: 'booking',
              title: 'Pandit Puja Booking',
              type: 'collapse', // changed from 'item' to 'collapse'
              icon: icons['SettingsInputComponentIcon'],
              // url: '/deity-list',
              allowedRoles: [1], // dono ke liye
              children: [
                {
                  id: 'booking',
                  title: 'Pandit Puja Booking',
                  type: 'item',
                  icon: icons['SettingsInputComponentIcon'],
                  url: '/pandit-puja-booking',
                  allowedRoles: [1]
                },
                {
                  id: 'booking',
                  title: 'Daily Pandit Booking (Puja)',
                  type: 'item',
                  icon: icons['SettingsInputComponentIcon'],
                  url: '/daily-pandit-puja-booking',
                  allowedRoles: [1]
                }
              ]
            },
            {
              id: 'booking',
              title: 'Temple Booking',
              type: 'collapse', // changed from 'item' to 'collapse'
              icon: icons['AddchartIcon'],
              // url: '/benefits',
              allowedRoles: [1], // dono ke liye
              children: [
                {
                  id: 'templePuja',
                  title: 'Remedy Puja Booking',
                  type: 'item',
                  icon: icons['Healing'],
                  url: '/remedy-puja-booking',
                  allowedRoles: [1]
                },
                {
                  id: 'templePuja',
                  title: 'Homam Booking',
                  type: 'item',
                  icon: icons['Whatshot'],
                  url: '/homam-booking',
                  allowedRoles: [1]
                },
                {
                  id: 'templePuja',
                  title: 'Subscription Puja Booking',
                  type: 'item',
                  icon: icons['Healing'],
                  url: '/subscription-puja-booking',
                  allowedRoles: [1]
                },
                {
                  id: 'templePuja',
                  title: 'Subscription Homam Booking',
                  type: 'item',
                  icon: icons['Whatshot'],
                  url: '/subscription-homam-booking',
                  allowedRoles: [1]
                },
                {
                  id: 'templePuja',
                  title: 'Puja At Temple Booking',
                  type: 'item',
                  icon: icons['AccountBalanceIcon'],
                  url: '/puja-at-temple-booking',
                  allowedRoles: [1]
                }
              ]
            },
            {
              id: 'estoreBookings',
              title: 'Estore Bookings',
              type: 'item', // changed from 'item' to 'collapse'
              icon: icons['AddchartIcon'],
              url: '/estore-bookings',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'prasadBookings',
              title: 'Prasad Bookings',
              type: 'item', // changed from 'item' to 'collapse'
              icon: icons['SettingsInputComponentIcon'],
              url: '/prasad-bookings',
              allowedRoles: [1] // dono ke liye
            }
          ]
        },

        // Master Pages
        {
          id: 'master',
          title: 'Master',
          type: 'collapse',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          children: [
            {
              id: 'master',
              title: 'Deity',
              type: 'item',
              icon: icons['SettingsInputComponentIcon'],
              url: '/deity-list',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'master',
              title: 'Benefits',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/benefits',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'master',
              title: 'State',
              type: 'item',
              icon: icons['SettingsInputComponentIcon'],
              url: '/state',
              allowedRoles: [1] // Need to confirm
            },
            {
              id: 'master',
              title: 'District',
              type: 'item',
              icon: icons['SettingsInputComponentIcon'],
              url: '/district',
              allowedRoles: [1] // Need to confirm
            },
          ]
        },

        // Estore
        {
          id: 'estore',
          title: 'Estore',
          type: 'collapse',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          children: [
            {
              id: 'estore-product-cat',
              title: 'Product Category',
              type: 'item',
              icon: icons['SettingsInputComponentIcon'],
              url: '/estore-product-category',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'estore-product',
              title: 'Product',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/estore-product',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'unit',
              title: 'Unit',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/unit',
              allowedRoles: [1] // dono ke liye
            }
          ]
        },
        // Banner
        {
          id: 'banner',
          title: 'Banner',
          type: 'item',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          url: '/banner'
        },

        // Notification
        {
          id: 'notification',
          title: 'Notification',
          type: 'collapse',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          // url: '/notification-template'
          children: [
            {
              id: 'notification',
              title: 'Notification Template',
              type: 'item',
              icon: icons['SettingsInputComponentIcon'],
              url: '/notification-template',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'notification',
              title: 'Calender Notification',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/calender-notification',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'notification',
              title: 'Regular Notification',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/regular-notification',
              allowedRoles: [1] // dono ke liye
            }
          ]
        },

        // User Wallet
        {
          id: 'user-wallet',
          title: 'User Wallet',
          type: 'item',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          url: '/user-wallet'
        },

        // {
        //   id: 'stock',
        //   title: 'Stock',
        //   type: 'item',
        //   icon: icons['InventoryIcon'],
        //   url: '/stock',
        //   allowedRoles: [2] // dono ke liye
        // },
        // {
        //   id: 'material',
        //   title: 'Material',
        //   type: 'item',
        //   icon: icons['ProductionQuantityLimitsIcon'],
        //   url: '/material',
        //   allowedRoles: [2] // dono ke liye
        // },
        {
          id: 'shopMaster',
          title: 'Shop Master',
          type: 'item',
          icon: icons['StoreIcon'],
          url: '/shop-master',
          allowedRoles: [2] // dono ke liye
        },
        {
          id: 'Purchase-Management',
          title: 'Purchase Management',
          type: 'item',
          icon: icons['ShoppingBagIcon'],
          url: '/Purchase-Management',
          allowedRoles: [2] // dono ke liye
        },

        // Thought Master
        {
          id: 'thought-master',
          title: 'Thought Master',
          type: 'item',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          url: '/thought-master'
        },

        // Webinar Users
        {
          id: 'webinar-users',
          title: 'Webinar Users List',
          type: 'item',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          url: '/webinar-users'
        },

        // Coupon Code
        {
          id: 'coupon-code',
          title: 'Coupon Code',
          type: 'item',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          url: '/coupon-code'
        },
        // FAQ
        {
          id: 'faq',
          title: 'FAQ',
          type: 'item',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          url: '/faq'
        },

        // Newsletter
        {
          id: 'newsletter',
          title: 'Newsletter',
          type: 'item',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          url: '/newsletter'
        },

        // Contact Us
        {
          id: 'contact-us',
          title: 'Contact Us',
          type: 'item',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          url: '/contact-us'
        },

        // Image Master
        {
          id: 'image-master',
          title: 'Image Master',
          type: 'collapse',
          icon: icons['BedroomParentIcon'],
          allowedRoles: [1],
          // url: '/image'

          children: [
            {
              id: 'image-category',
              title: 'Image Category',
              type: 'item',
              icon: icons['AddchartIcon'],
              url: '/image-category',
              allowedRoles: [1] // dono ke liye
            },
            {
              id: 'image',
              title: 'Image',
              type: 'item',
              icon: icons['TempleHindu'],
              url: '/image',
              allowedRoles: [1]
            }
          ]
        }

        // {
        //   id: 'warehouse',
        //   title: 'Warehouse',
        //   type: 'item',
        //   icon: icons['StorefrontIcon'],
        //   url: '/warehouse',
        //   allowedRoles: [2] // dono ke liye
        // },
      ]
    }
  ]
};
