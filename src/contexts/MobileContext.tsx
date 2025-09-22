import { ReactNode, createContext, useContext, useState } from "react";

interface MobileContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <MobileContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </MobileContext.Provider>
  );
};
