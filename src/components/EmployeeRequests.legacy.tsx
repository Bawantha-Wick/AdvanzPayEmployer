import React from 'react';

const EmployeeRequests: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Requests</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <input type="text" placeholder="Search employees..." className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC7356]" />
              <button className="bg-[#DC7356] text-white px-4 py-2 rounded-lg hover:bg-[#c06549]">Add New Employee</button>
            </div>
            <div>
              <button className="border border-[#DC7356] text-[#DC7356] px-4 py-2 rounded-lg hover:bg-[#DC7356] hover:text-white">Export Data</button>
            </div>
          </div>

          <div className="bg-white overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">EMP001</td>
                  <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap">IT</td>
                  <td className="px-6 py-4 whitespace-nowrap">Software Engineer</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-[#DC7356] hover:text-[#c06549] mr-2">Edit</button>
                    <button className="text-blue-600 hover:text-blue-800 mr-2">View</button>
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

export default EmployeeRequests;
