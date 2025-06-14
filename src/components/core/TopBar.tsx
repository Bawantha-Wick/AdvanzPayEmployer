import React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
interface TopBarProps {
  title?: string;
  notificationCount?: number;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard', notificationCount = 1 }) => {
  return (
    <div className="h-22 flex items-center bg-white">
      <label className="text-3xl font-semibold" style={{ marginLeft: '1rem', color: '#66676a' }}>
        {title}
      </label>

      <div className="flex-grow"></div>
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
