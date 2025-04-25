import React from 'react';
import { User } from 'lucide-react';

const UserList = ({ users, onUserSelect, selectedUser, userType }) => {
  // Function to get user's initials
  const getInitials = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    } else if (user.name) {
      return user.name.charAt(0);
    }
    return 'U';
  };

  // Determine color theme based on userType
  const themeColor = userType === 'student' ? 'green' : 'blue';
  const avatarBgColor = userType === 'student' ? 'bg-green-100' : 'bg-blue-100';
  const avatarTextColor = userType === 'student' ? 'text-green-600' : 'text-blue-600';
  const selectedBgColor = userType === 'student' ? 'bg-green-50' : 'bg-blue-50';

  // Check if there are users to display
  if (users.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Connections</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-500">
          <div>
            <User size={40} className="mx-auto mb-2 opacity-40" />
            <p className="font-medium">No users found</p>
            <p className="text-sm mt-1">Check back later for new connections</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">
          {userType === 'student' ? 'Alumni Connections' : 'Student Connections'}
        </h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => onUserSelect(user)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedUser?._id === user._id ? selectedBgColor : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${avatarBgColor} rounded-full flex items-center justify-center`}>
                <span className={`${avatarTextColor} font-semibold`}>
                  {getInitials(user)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.name || 'User'}
                </h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;