import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './core/SideBar';
import TopBar from './core/TopBar';

const Layout: React.FC = () => {
  const location = useLocation();

  // Function to determine the page title based on the current path
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';

    // Map routes to their corresponding titles
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      users: 'User Management',
      'user-roles': 'User Roles',
      employees: 'Employee Management',
      'employee-requests': 'Employee Requests',
      'authorize-employees': 'Authorize Employees',
      settlements: 'Settlements'
    };

    return titles[path] || 'Dashboard';
  };

  return (
    // bg-[#FAF9F6]
    // <div className="bg-blue-100 flex min-h-screen">
    <div className="flex" style={{ backgroundColor: '#fffaee' }}>
      <SideBar />
      {/* <main className="" style={{ marginLeft: '18rem', width: '100%' }}> */}
      <div className="flex-1">
        <TopBar title={getPageTitle()} />
        {/* <div className="flex bg-red-100" style={{  width: '80vw' , height: '80vh'}}> */}
        <div className="bg-red-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
