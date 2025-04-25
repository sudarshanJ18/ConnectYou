import React from 'react';

const LoadingState = ({ 
  userType, 
  message = 'Loading connections...' 
}) => {
  const spinnerColor = userType === 'student' ? 'border-green-500' : 'border-blue-500';
  
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${spinnerColor} mx-auto`}></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;