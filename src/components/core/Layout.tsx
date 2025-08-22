import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import TopBar from './TopBar';

const Layout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#fffaee' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <SideBar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={getPageTitle()} onMenuClick={toggleSidebar} />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
