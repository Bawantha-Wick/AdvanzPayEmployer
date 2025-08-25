import React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { useAuthContext } from '../../contexts/useAuthContext';

interface TopBarProps {
  title?: string;
  notificationCount?: number;
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard', notificationCount = 1, onMenuClick }) => {
  const { user } = useAuthContext();

  return (
    <div className="h-22 flex items-center bg-white px-4 lg:px-0">
      {/* Mobile menu button */}
      <button onClick={onMenuClick} className="lg:hidden p-2 mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
        <HiOutlineMenuAlt3 size={24} />
      </button>

      <label className="text-xl lg:text-3xl font-semibold flex-1" style={{ marginLeft: '1rem', color: '#66676a' }}>
        {title}
      </label>

      <div className="flex-grow"></div>

      {/* User greeting */}
      {user && (
        <div className="hidden lg:flex items-center mr-4">
          <span className="text-sm text-gray-600 mr-2">Welcome,</span>
          <span className="text-sm font-medium text-gray-800">{user.name}</span>
        </div>
      )}

      <Stack direction="row" sx={{ marginRight: '1.5rem', color: 'action.active' }}>
        <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500">
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 28, color: 'white' }} />
          {notificationCount > 0 && <div className="absolute w-2 h-2 bg-white rounded-full border-2 border-white flex" style={{ marginLeft: '12px', marginTop: '-8px' }}></div>}
        </div>
      </Stack>
    </div>
  );
};

export default TopBar;
