import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

const Layout: React.FC = () => {
  return (
    // bg-[#FAF9F6]
    // <div className="bg-blue-100 flex min-h-screen">
    <div className="flex">
      <SideBar />
      {/* <main className="" style={{ marginLeft: '18rem', width: '100%' }}> */}
      <main >
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
