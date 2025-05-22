import React from 'react';
import SideBar from './SideBar';
// import UserManagement from './UserManagement';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      <SideBar />
      {/* <UserManagement /> */}
    </div>
  );
};

export default Layout; 