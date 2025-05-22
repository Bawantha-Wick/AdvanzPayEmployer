import React, { useState } from 'react';
import { FaSearch, FaPen } from 'react-icons/fa';
import { IoNotifications } from 'react-icons/io5';

interface User {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const users: User[] = [
    { name: 'Christine Brooks', email: 'brooks@gmail.com', role: 'Admin', status: 'Active' },
    { name: 'Christine Brooks', email: 'brooks@gmail.com', role: 'Admin', status: 'Inactive' },
    { name: 'Christine Brooks', email: 'brooks@gmail.com', role: 'Admin', status: 'Active' },
    { name: 'Christine Brooks', email: 'brooks@gmail.com', role: 'Admin', status: 'Active' },
    { name: 'Christine Brooks', email: 'brooks@gmail.com', role: 'Admin', status: 'Active' },
    { name: 'Christine Brooks', email: 'brooks@gmail.com', role: 'Admin', status: 'Active' },
  ];

  return (
    <div className="flex-1 p-6 bg-[#FAF9F6]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            <IoNotifications className="text-2xl text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </button>
        </div>
      </div>

      {/* Search and Add User */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search mail"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="bg-[#D96B5D] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span>+</span>
          Add new user
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">NAME</th>
              <th className="text-left p-4">EMAIL</th>
              <th className="text-left p-4">USER ROLE</th>
              <th className="text-left p-4">APPROVE STATUS</th>
              <th className="text-left p-4">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.status === 'Active'
                        ? 'bg-[#E8F5E9] text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-[#D96B5D] flex items-center gap-2">
                    <FaPen className="text-sm" />
                    View & Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex justify-between items-center text-sm text-gray-600">
          <div>Showing 1 of 78</div>
          <div className="flex gap-2">
            <button className="px-2 py-1 border rounded">←</button>
            <button className="px-2 py-1 border rounded">→</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 