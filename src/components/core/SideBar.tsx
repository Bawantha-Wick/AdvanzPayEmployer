import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { BsFileEarmarkText } from 'react-icons/bs';
import { IoHomeOutline, IoAddOutline } from 'react-icons/io5';
import { RiFileListLine } from 'react-icons/ri';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { BiLogOut } from 'react-icons/bi';
import innerLogo from '../../assets/inner_logo.png';
import profileImg from '../../assets/profile.png';
import { LuUserRoundPlus, LuUserRoundCheck } from 'react-icons/lu';
import { useAuthContext } from '../../contexts/useAuthContext';

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['userManagement']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout by clearing storage and navigating
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      navigate('/signin', { replace: true });
    }
  };

  const menuItemStyles = {
    // marginLeft: '3.5rem',
    marginTop: '1.5rem'
  };

  const iconStyles = {
    marginRight: '1rem'
  };

  const subMenuStyles = {
    marginLeft: '3.5rem'
    // marginTop: '1rem'
  };

  const subMenuItemStyles = {
    marginLeft: '0.5rem',
    marginTop: '0.75rem'
  };

  const subMenuIconStyles = {
    marginTop: '1rem'
    // marginRight: '1rem'
  };

  const expandIconStyles = {
    marginRight: '1.5rem'
  };

  return (
    <div className="w-84 bg-[#DC7356] min-h-screen flex flex-col text-white">
      <div className="flex justify-center py-4">
        <img src={innerLogo} alt="AdvanzPay" className="h-15" style={{ marginTop: '1.5rem' }} />
      </div>

      {/* Navigation */}
      <nav className="flex-1" style={{ marginTop: '4rem', marginLeft: '3rem' }}>
        {/* Dashboard */}
        <div style={menuItemStyles}>
          <Link to="/app/dashboard" className="flex text-white hover:bg-[#DC7356] transition-colors">
            <IoHomeOutline className="text-xl" style={iconStyles} />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* User Management */}
        <div style={menuItemStyles}>
          <button onClick={() => toggleMenu('userManagement')} className="w-full flex items-center justify-between text-white hover:bg-[#DC7356] transition-colors">
            <div className="flex items-center">
              <FaRegUser className="text-xl" style={iconStyles} />
              <span>User Management</span>
            </div>
            {expandedMenus.includes('userManagement') ? <MdKeyboardArrowDown className="text-xl" style={expandIconStyles} /> : <MdKeyboardArrowRight className="text-xl" style={expandIconStyles} />}
          </button>
          {expandedMenus.includes('userManagement') && (
            <div className="flex flex-col bg-[#DC7356]" style={subMenuStyles}>
              <Link to="/app/users" className="flex block py-2">
                <IoAddOutline className="text-xl" style={subMenuIconStyles} />
                <span style={subMenuItemStyles}>Users</span>
              </Link>
              <Link to="/app/user-roles" className="flex block py-2">
                <RiFileListLine className="text-xl" style={subMenuIconStyles} />
                <span style={subMenuItemStyles}>User Roles</span>
              </Link>
            </div>
          )}
        </div>

        {/* Employee Management */}
        <div style={menuItemStyles}>
          <button onClick={() => toggleMenu('employeeManagement')} className="w-full flex items-center justify-between text-white hover:bg-[#DC7356] transition-colors">
            <div className="flex items-center">
              <HiOutlineUserGroup className="text-xl" style={iconStyles} />
              <span>Employee Management</span>
            </div>
            {expandedMenus.includes('employeeManagement') ? <MdKeyboardArrowDown className="text-xl" style={expandIconStyles} /> : <MdKeyboardArrowRight className="text-xl" style={expandIconStyles} />}
          </button>
          {expandedMenus.includes('employeeManagement') && (
            <div className="bg-[#DC7356]" style={subMenuStyles}>
              <Link to="/app/employees" className="flex block py-2">
                <FaRegUser className="text-l" style={subMenuIconStyles} />
                <span style={subMenuItemStyles}>Employees</span>
              </Link>
              <Link to="/app/employee-requests" className="flex block py-2">
                <LuUserRoundPlus className="text-xl" style={subMenuIconStyles} />
                <span style={subMenuItemStyles}>Employee Requests</span>
              </Link>
              <Link to="/app/authorize-employees" className="flex block py-2">
                <LuUserRoundCheck className="text-xl" style={subMenuIconStyles} />
                <span style={subMenuItemStyles}>Authorize Employees</span>
              </Link>
            </div>
          )}
        </div>

        {/* Settlements */}
        <div style={menuItemStyles}>
          <Link to="/app/settlements" className="flex text-white hover:bg-[#DC7356] transition-colors">
            <BsFileEarmarkText className="text-xl" style={iconStyles} />
            <span>Settlements</span>
          </Link>
        </div>

        {/* Reports */}
        <div style={menuItemStyles}>
          <Link to="/app/reports" className="flex text-white hover:bg-[#DC7356] transition-colors">
            <BsFileEarmarkText className="text-xl" style={iconStyles} />
            <span>Reports</span>
          </Link>
        </div>
        {/* <div style={menuItemStyles}>
          <button onClick={() => toggleMenu('reports')} className="w-full flex items-center justify-between text-white hover:bg-[#DC7356] transition-colors">
            <div className="flex items-center">
              <BsFileEarmarkText className="text-xl" style={iconStyles} />
              <span>Reports</span>
            </div>
            {expandedMenus.includes('reports') ? <MdKeyboardArrowDown className="text-xl" style={expandIconStyles} /> : <MdKeyboardArrowRight className="text-xl" style={expandIconStyles} />}
          </button>
        </div> */}
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-[#DC7356] bg-[#e08368]" style={{ marginBottom: '2rem', marginLeft: '2rem', marginRight: '2rem' }}>
        <button onClick={() => toggleMenu('profile')} className="w-full flex justify-center hover:bg-[#DC7356] transition-colors gap-5" style={{ marginTop: '1.25rem', paddingBottom: '1.25rem' }}>
          <img src={profileImg} alt="Profile" className="w-10 h-10 rounded" />
          <div className="text-center">
            <div className="font-medium">{user?.name || 'User'}</div>
            <div className="text-sm opacity-75">{user?.role || 'Admin'}</div>
          </div>
          <MdKeyboardArrowDown className="text-xl ml-3" />
        </button>
        {expandedMenus.includes('profile') && (
          <div className="bg-[#e08368] border-t border-[#DC7356]">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 hover:bg-[#DC7356] transition-colors text-white">
              <BiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
