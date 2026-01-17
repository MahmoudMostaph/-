import React from 'react';
import { ArrowPathIcon } from './Icons';

interface UpdatePromptProps {
  onUpdate: () => void;
}

const UpdatePrompt: React.FC<UpdatePromptProps> = ({ onUpdate }) => {
  return (
    <div 
      role="alert"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-4 rtl:space-x-reverse z-[100]"
    >
      <p className="font-semibold">تحديث جديد متوفر!</p>
      <button
        onClick={onUpdate}
        className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300"
      >
        <ArrowPathIcon className="w-5 h-5" />
        <span>تحديث الآن</span>
      </button>
    </div>
  );
};

export default UpdatePrompt;
