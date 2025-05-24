import React from 'react';

const UserRoles: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Roles</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <input type="text" placeholder="Search roles..." className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC7356]" />
              <button className="bg-[#DC7356] text-white px-4 py-2 rounded-lg hover:bg-[#c06549]">Add New Role</button>
            </div>
          </div>

          <div className="bg-white overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Administrator</td>
                  <td className="px-6 py-4">Full system access</td>
                  <td className="px-6 py-4">All permissions</td>
                  <td className="px-6 py-4 whitespace-nowrap">5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-[#DC7356] hover:text-[#c06549] mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
