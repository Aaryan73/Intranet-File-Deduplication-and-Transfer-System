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
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      switchTab('popup');
    }
  }, []);

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
