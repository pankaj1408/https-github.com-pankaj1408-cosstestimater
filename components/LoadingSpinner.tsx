
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
       <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
       <p className="text-slate-400">Consulting the AI cloud...</p>
    </div>
  );
};

export default LoadingSpinner;
