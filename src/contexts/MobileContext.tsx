import { ReactNode, createContext, useContext, useState } from "react";

interface MobileContextType {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleSidebarCollapsed: () => void;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error("useMobile must be used within a MobileProvider");
  }
  return context;
};

interface MobileProviderProps {
  children: ReactNode;
}

export const MobileProvider = ({ children }: MobileProviderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <MobileContext.Provider value={{
      isSidebarOpen,
      isSidebarCollapsed,
      toggleSidebar,
      toggleSidebarCollapsed
    }}>
      {children}
    </MobileContext.Provider>
  );
};
