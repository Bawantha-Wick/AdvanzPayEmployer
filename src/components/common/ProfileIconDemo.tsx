import React from 'react';
import ProfileIcon from './ProfileIcon';

const ProfileIconDemo: React.FC = () => {
  const sampleNames = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Anderson', 'Robert Taylor', 'Emily Davis', 'Christopher', 'A', 'AB', 'ABC', 'ABCD', 'John Michael Smith'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Profile Icon Demo</h1>

      {/* Different Sizes */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Different Sizes</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <ProfileIcon name="John Doe" size="sm" />
            <p className="text-xs mt-1">Small</p>
          </div>
          <div className="text-center">
            <ProfileIcon name="John Doe" size="md" />
            <p className="text-xs mt-1">Medium</p>
          </div>
          <div className="text-center">
            <ProfileIcon name="John Doe" size="lg" />
            <p className="text-xs mt-1">Large</p>
          </div>
          <div className="text-center">
            <ProfileIcon name="John Doe" size="xl" />
            <p className="text-xs mt-1">Extra Large</p>
          </div>
        </div>
      </div>

      {/* Different Names */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Different Names & Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {sampleNames.map((name, index) => (
            <div key={index} className="text-center">
              <ProfileIcon name={name} size="lg" />
              <p className="text-xs mt-2 break-words">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Usage Examples</h2>

        {/* User List */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-medium mb-3">User List</h3>
          <div className="space-y-2">
            {sampleNames.slice(0, 5).map((name, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <ProfileIcon name={name} size="md" />
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-3">Navigation Bar Example</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <ProfileIcon name="Current User" size="sm" />
              <span className="text-sm">Current User</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Code Examples</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Basic Usage:</h3>
            <code className="bg-gray-100 p-2 rounded block text-sm">{`<ProfileIcon name="John Doe" />`}</code>
          </div>
          <div>
            <h3 className="font-medium mb-2">With Size:</h3>
            <code className="bg-gray-100 p-2 rounded block text-sm">{`<ProfileIcon name="Jane Smith" size="lg" />`}</code>
          </div>
          <div>
            <h3 className="font-medium mb-2">With Click Handler:</h3>
            <code className="bg-gray-100 p-2 rounded block text-sm">{`<ProfileIcon name="User Name" onClick={() => console.log('Clicked!')} />`}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileIconDemo;
