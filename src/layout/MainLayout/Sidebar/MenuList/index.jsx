import React, { useContext } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { ConfigContext } from 'context/ConfigContext';

// ==============================|| MENULIST ||============================== //

const MenuList = ({ drawerToggle }) => {


  const { user, } = useContext(ConfigContext);
  const userRoleId = user?.roleTypeID; // e.g. 1 or 2



  // Recursive filter function
  const filterByRole = (items) => {
    return items
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterByRole(item.children);
          return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
        }
        // Show if no allowedRoles OR if role matches
        return !item.allowedRoles || item.allowedRoles.includes(userRoleId) ? item : null;
      })
      .filter(Boolean);
  };

  const filteredItems = filterByRole(menuItem.items);



  const navItems = filteredItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} drawerToggle={drawerToggle} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return navItems;
};

export default MenuList;
