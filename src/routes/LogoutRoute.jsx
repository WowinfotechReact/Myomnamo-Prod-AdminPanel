// views/Logout.js
import { useEffect } from 'react';
import { useAuth } from 'context/ConfigContext';

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout(); // Perform logout on mount
  }, []);

  return null; // Optional: show "Logging out..." message
};

export default Logout;
