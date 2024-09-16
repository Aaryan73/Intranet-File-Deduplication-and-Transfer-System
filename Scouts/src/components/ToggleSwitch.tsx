import { useEffect, useState } from 'react';
import { useTab } from '../hooks/TabContext';
import axios from 'axios';

const ToggleSwitch = () => {
  const [isChecked, setIsChecked] = useState(true);
  const { switchTab } = useTab();
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.get('http://52.172.0.204:8080/api/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          setIsChecked(response.data.is_active);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem('accessToken');
          switchTab('login');
        });
    } else {
      switchTab('register');
    }
  }, [switchTab]);

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
        {isChecked ? 'Active' : 'Deactive'}
      </span>
    </label>
  );
};

export default ToggleSwitch;
