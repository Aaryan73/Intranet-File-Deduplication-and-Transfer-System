import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TabContextType {
  activeTab: string;
  switchTab: (tab: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
}

export const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');

  const switchTab = (tab: string) => setActiveTab(tab);

  useEffect(() => {
    // Check localStorage for userData
    const userData = localStorage.getItem('userData');

    // If userData exists, switch to the 'popup' tab
    if (userData) {
      switchTab('popup');
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <TabContext.Provider value={{ activeTab, switchTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = (): TabContextType => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
};
