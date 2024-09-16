import React from 'react';
import Popup from './pages/PopupScreen';
import RegisterPage from './pages/RegisterPage';
import { useTab } from './hooks/TabContext';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import Profile from './pages/ProfilePage';
import { HomePage } from './pages/HomePage';

const App: React.FC = () => {
  const { activeTab } = useTab();

  const renderContent = () => {
    switch (activeTab) {
      case 'popup':
        return <Popup />;
      case 'register':
        return <RegisterPage />;
      case 'login':
        return <LoginPage />;
      case 'profile':
        return <Profile />;
      case 'home':
        return <HomePage />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className='h-screen hide-scrollbar w-full flex flex-col items-center justify-center bg-gray-800'>
      <div><Toaster /></div>
      {renderContent()}
    </div>
  );
}

export default App;
