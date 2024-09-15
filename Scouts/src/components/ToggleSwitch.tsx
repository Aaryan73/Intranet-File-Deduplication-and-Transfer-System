import { useState } from 'react';

const ToggleSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="sr-only peer"
      />
      <div
        className={`relative w-11 h-6 rounded-full ${isChecked ? 'bg-blue-600' : 'bg-gray-500'}  `}
      >
        <div
          className={`absolute top-[2px] ${isChecked ? 'translate-x-full' : 'translate-x-0'} left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-all dark:border-gray-600`}
        />
      </div>
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {isChecked ? 'Deactive' : 'Active'}
      </span>
    </label>
  );
};

export default ToggleSwitch;
